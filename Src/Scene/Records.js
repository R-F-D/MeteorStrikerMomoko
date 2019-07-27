/* *******************************************************************************
	Recordsシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN:	"Records.Main",
	BG:		"Records.Bg",
};

const PanelPosition		= {X:96,Y:240};
const RecordBoard	= {
	MaxRows:			5,
	MaxColumns:			2,
	Size:				{Width:160, Height:32},
	NumLogLines:		2,
};
const AchievementBoard	= {
	MaxRows:			4,
	MaxColumns:			1,
	Size:				{Width:324, Height:48},
	NumLogLines:		4,
};
RecordBoard.Max			= RecordBoard.MaxRows * RecordBoard.MaxColumns;
AchievementBoard.Max	= AchievementBoard.MaxRows * AchievementBoard.MaxColumns;
const MaxDisplayBoards	= Math.max(RecordBoard.Max,AchievementBoard.Max);

Scene.Records	= class extends Scene.SceneBase {


	constructor(){
		super();

		this.Sequences	= {
			INITIAL:		null,	//初期状態
			RECORDS:		null,	//記録一覧
			ACHIEVEMENTS:	null,	//実績一覧
			TRANSITION:		null,	//トランジション用
		};
		this.SetMode(Scene.Records.Mode.Records,false);

		this.sprites		= {};
		this.buttons		= {};
		this.displayBoards	= [];	//表示板

		/** ccSceneのインスタンス */
		this.ApplicateCcSceneInstance(this).InitLayerList();

		//シークエンス設定
		for(let i in this.Sequences){ this.Sequences[i] = Scene.Sequence.Create() }
		this.SetSequenceFunctions().InitEventListenerList();
	}


	/** ccLayerに渡す用 */
	InitLayerList(){
		const _this	= this;
		super.InitLayerList()
			.AddToLayerList("main",{
				ctor:function(){
					this._super();
					this.scheduleUpdate();

					//表示板
					_this.displayBoards	= _.range(MaxDisplayBoards).map( h=>{
						let board	= {};
						board.body		= Label.CreateInstance( 9).AddToLayer(this).SetBgEnabled(true).SetAnchorPoint(0.0, 0.5);
						board.body.bg.easeFunc	= ()=>cc.easeElasticOut(10);

						if		(_this.mode==Scene.Records.Mode.Records){
							board.counter	= Label.CreateInstance(11).AddToLayer(this).SetAnchorPoint(1.0, 0.5);
						}
						else if	(_this.mode==Scene.Records.Mode.Achievements){
							board.text		= Label.CreateInstance(9).AddToLayer(this).SetAnchorPoint(0.0, 0.5);
							board.date		= Label.CreateInstance(9).AddToLayer(this).SetAnchorPoint(1.0, 0.5);
						}
						return board;
					});

					return true;
				},
			})
			.AddToLayerList("bg",{
				ctor:function(){
					this._super();
					this.scheduleUpdate();
					_this.sprites.bg	= _.range(2).map(i=> Sprite.CreateInstance(rc.img.bgGround).AddToLayer(this).SetVisible(true) );
					return true;
				},
				update	: function(dt){
					this._super();
					const width		= cc.director.getWinSize().width;
					const bgWidth	= _this.sprites.bg[0].GetPieceSize().width;
					_this.sprites.bg.forEach((v,i)=>v.SetPosition(	width /2 - Cycle(_this.count, 0, bgWidth) + bgWidth*i,	256) );
				},
			})

		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.SetLayer(LinkedLayerTags.BG,  this.ccLayers.bg,  0x0000)
			.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット

		this.InitSequences(this.Sequences,LinkedLayerTags.MAIN,this.ccLayerInstances[LinkedLayerTags.MAIN])
			.SetSequence(this.Sequences.INITIAL);

		if(this.pager)	this.pager.onPageChanged	= ()=>this.SetSequence(this.Sequences.TRANSITION);
		return this;
	}

	OnUpdating(dt){
		super.OnUpdating(dt);
		this.displayBoards.forEach( board=>board.body.Update(dt) );
		return this;
	}

	SetSequenceFunctions(){
		const size		= cc.director.getWinSize();

		//初期状態
		this.Sequences.INITIAL.PushStartingFunctions(()=>{
			//ラベル
			this.displayBoards
				.forEach(board=> board.body.Init() );

		})
		.PushUpdatingFunctions(dt=>{
			 if(this.sequence.count>=60)	this.SetSequence(this.processScene());
		});

		//スコア表示
		this.Sequences.RECORDS.PushStartingFunctions(()=>{
			let handles	= Store.GetVisibleHandles( this.pager ? this.pager.GetPage() : null);
			if(RecordBoard.Max < handles.length){
				handles.length	= RecordBoard.Max;
				Debug(()=>{throw new Error("Too many records")});
			}

			//ラベル
			this.displayBoards
				.forEach((board,i)=>{
					const handle	= handles.shift();
					if(!handle){
						board.body.SetVisible(false);
						board.counter.SetVisible(false);
						return;
					}

					//カウンタと公開フラグ
					//ヘッダテキスト＆カウンタ
					let count		= Store.Select(handle.Key,0);
					if(handle.Conv)	count = handle.Conv(count);
					if(String(Number(count))===count)	count = Number(count);

					const isPublic	= handle.Required!==null && handle.Required<=count || handle.Required===0;

					//カウンタと公開フラグ
					let text		= "";
					let fmtCount	= "";
					if(isPublic){
						count			= _.isString(count)	? count	: L.NumToStr(count, handle.nDecimalDigits);
						const patterns	= L.TextExists(handle.UnitKey)	? [count, L.Text(handle.UnitKey)]	: [count];
						fmtCount		= L.TextExists(`Records.${handle.Key}.Format`) ? L.Textf( `Records.${handle.Key}.Format`,patterns) : L.Textf("Unit.Counter",patterns);
						text			= L.Text(`Records.${handle.Key}`);
					}
					else{
						fmtCount		= L.Text("Records.Secret.Format");
						text			= L.TextExists(`Records.${handle.Key}.Secret`) ? L.Text(`Records.${handle.Key}.Secret`) : L.Text("Records.Secret");
					}

					const x	= Math.trunc(i/RecordBoard.MaxRows) * (RecordBoard.Size.Width+4);
					const y	= (i%RecordBoard.MaxRows) * (RecordBoard.Size.Height+4);
					board.body.bg.lower			= {width:RecordBoard.Size.Width, height:RecordBoard.Size.Height};
					board.body.bg.animationDelay= 0.05*i;
					board.body.bg.OPACITY		= isPublic	? 128 : 64;
					board.body.SetColor(	isPublic ? "#FFFF00" : "#AFAF00");
					board.counter.SetColor(	isPublic ? "#FFFFFF" : "#AFAFAF");;

					board.body
						.SetVisible(true)
						.SetNumLogLines(RecordBoard.NumLogLines)
						.SetPosition(PanelPosition.X+x,PanelPosition.Y-y)
						.SetString(` ${text}`);
					board.counter
						.SetVisible(false)
						.SetPosition(PanelPosition.X+x+RecordBoard.Size.Width-2,PanelPosition.Y-y-6)
						.SetString(`${fmtCount}`);
					board.body.bg.animationDelay	= 0.0;
				});
		})
		.PushUpdatingFunctions(dt=>{
			this.displayBoards.forEach((board,i)=>{
				if(board.body.IsVisible() && !board.body.bg.IsRunningActions())		board.counter.SetVisible(true);
			});
		});

		//実績一覧
		this.Sequences.ACHIEVEMENTS.PushStartingFunctions(()=>{
			let handles	= Achievement.GetHandles( this.pager ? this.pager.GetPage() : null);
			if(AchievementBoard.Max < handles.length){
				handles.length	= AchievementBoard.Max;
				Debug(()=>{throw new Error("Too many achievements")});
			}

			//ラベル
			this.displayBoards
				.forEach((board,i)=>{
					board.body.SetVisible(false);
					board.text.SetVisible(false);
					board.date.SetVisible(false);

					const handle	= handles.shift();
					if(!handle)	return;

					let date		= Store.Select(handle.Key,"");
					if(date!="")	date	= (new Date(Number(date))).toLocaleString();

					const title		= L.Text(handle.Key);
					const text		= Array.isArray(handle.Replacements)	? L.Textf(`${handle.Key}.Text`, [handle.Count].concat(handle.Replacements) )
																			: L.Text(`${handle.Key}.Text`);

					const x	= Math.trunc(i/AchievementBoard.MaxRows) * (AchievementBoard.Size.Width+4);
					const y	= (i%AchievementBoard.MaxRows) * (AchievementBoard.Size.Height+4);
					board.body.bg.lower			= {width:AchievementBoard.Size.Width, height:AchievementBoard.Size.Height};
					board.body.bg.animationDelay= 0.05*i;
					board.body.SetColor(	"#FFFF00");
					board.text.SetColor(	"#CFCFCF");;
					board.date.SetColor(	"#FFFFFF");;

					board.body
						.SetVisible(true)
						.SetNumLogLines(AchievementBoard.NumLogLines)
						.SetPosition(PanelPosition.X+x,PanelPosition.Y-y)
						.SetString(` ${title}`);
					board.text
						.SetNumLogLines(2)
						.SetPosition(PanelPosition.X+x+2,PanelPosition.Y-y)
						.SetString(text);
					board.date
						.SetNumLogLines(1)
						.SetPosition(PanelPosition.X+x+AchievementBoard.Size.Width-2,PanelPosition.Y-y-16+1)
						.SetString(`${date}`);
					board.body.bg.animationDelay	= 0.0;
				});

		})
		.PushUpdatingFunctions(dt=>{
			this.displayBoards.forEach((board,i)=>{
				if(board.body.IsVisible() && !board.body.bg.IsRunningActions()){
					board.text.SetVisible(true);
					board.date.SetVisible(true);
				}
			});
		});

		//トランジション
		this.Sequences.TRANSITION.PushStartingFunctions(()=>{
			this.displayBoards.forEach(b=>{
				["body","counter","text","date"].forEach(i=>{
					if(b[i] && b[i].IsVisible())	b[i].RemoveString(false);
				});
			});
		})
		.PushUpdatingFunctions(dt=>{
			if( _(this.displayBoards).every(b=>!b.body.IsVisible() || !b.body.bg.IsRunningActions()) )	this.SetSequence(this.processScene());
		});

		return this;
	}

	InitEventListenerList(){
		super.InitEventListenerList();

		//共通イベント対応設定
		let commonEvents	= [];
		commonEvents.push(this.listeners.touched);
		commonEvents.push(this.listeners.keyboardReset);
		this.SetCommonEventListeners("SceneBase.TouchFx",commonEvents);

		return this;
	}

	/** 記録/実績のモード設定
	 * @param {*} mode
	 * @param {boolean} [initializes=true]
	 * @returns
	 */
	SetMode(mode,initializes=true){
		this.mode	= mode;
		this.processScene	= this.mode==Scene.Records.Mode.Records	? ()=>this.Sequences.RECORDS	: ()=>this.Sequences.ACHIEVEMENTS;


		//Init
		if(initializes){
			if(this.mode===Scene.Records.Mode.Achievements)	this.EnableNaviButtons(Achievement.NumPages);
			else if(this.mode===Scene.Records.Mode.Records)	this.EnableNaviButtons(Store.NumPages);
		}
		return this;
	}
	static get Mode(){
		return {
			Achievements:	1,
			Records:		2,
		};
	}

}//class

})();	//File Scope

