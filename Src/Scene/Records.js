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

const PanelPosition		= {X:16+64,Y:16};
const RecordBoard	= {
	MaxRows:			5,
	MaxColumns:			2,
	Size:				{Width:32*6-1, Height:32-1},
	NumLogLines:		2,
};
const AchievementBoard	= {
	MaxRows:			4,
	MaxColumns:			1,
	Size:				{Width:32*11-64, Height:64-1},
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

		//シークレット項目の公開設定
		this.isPublic	= false;
		Debug(()=>{
			this.isPublic	= !!Number(Store.Select(Store.Handles.Settings.RecordIsPublic,0));
			Store.Insert( Store.Handles.Settings.RecordIsPublic,Number(this.isPublic),null);
		});

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
						board.body		= Label.CreateInstance( 9).AddToLayer(this).SetBgEnabled(true).SetAnchorPoint(0.0, 1.0);
						board.body.bg.easeFunc	= ()=>cc.easeElasticOut(10);

						board.foot	= Label.CreateInstance(11).AddToLayer(this).SetAnchorPoint(1.0, 0.0);
						board.text		= Label.CreateInstance(9).AddToLayer(this).SetAnchorPoint(0.0, 1.0);
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

		if(this.pager){
			this.pager.onChapterChanged	= ()=> this.SetMode(this.pager.GetChapter(),false);
			this.pager.onPageChanged	= ()=> this.SetSequence(this.Sequences.TRANSITION);
		}
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
				.forEach(board=>{
					board.body.Init();
					board.text.Init();
					board.foot.Init();
				});
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
					board.body.SetVisible(false).SetIcon(null);
					board.text.SetVisible(false);
					board.foot.SetVisible(false);

					const handle	= handles.shift();
					if(!handle)	return;

					//カウンタと公開フラグ
					//ヘッダテキスト＆カウンタ
					let count		= Store.Select(handle.Key,0);
					if(handle.Conv)	count = handle.Conv(count);
					if(String(Number(count))===count)	count = Number(count);

					const isPublic	= handle.Required!==null && handle.Required<=count || handle.Required===0;

					//カウンタと公開フラグ
					let text		= "";
					let fmtCount	= "";
					if(this.isPublic || isPublic){
						count			= _.isString(count)	? count	: L.NumToStr(count, handle.nDecimalDigits);
						const patterns	= L.TextExists(handle.UnitKey)	? [count, L.Text(handle.UnitKey)]	: [count];
						fmtCount		= L.TextExists(`Records.${handle.Key}.Format`) ? L.Textf( `Records.${handle.Key}.Format`,patterns) : L.Textf("Unit.Counter",patterns);
						text			= L.Text(`Records.${handle.Key}`);
					}
					else{
						fmtCount		= L.Text("Records.Secret.Format");
						text			= L.TextExists(`Records.${handle.Key}.Secret`) ? L.Text(`Records.${handle.Key}.Secret`) : L.Text("Records.Secret");
					}

					const x	= Math.trunc(i/RecordBoard.MaxRows) * (RecordBoard.Size.Width+1);
					const y	= (i%RecordBoard.MaxRows) * (RecordBoard.Size.Height+1);
					board.body.bg.lower			= {width:RecordBoard.Size.Width, height:RecordBoard.Size.Height};
					board.body.bg.animationDelay= 0.05*i;
					if(isPublic){
						board.body.bg.OPACITY	= 128;
						board.body.SetFontColor("#FFCF00","#7F0000",1);
						board.foot.SetFontColor("#FFFFFF");
					}
					else{
						board.body.bg.OPACITY	= 64;
						board.body.SetFontColor("#AFAF00","#1F0000",1);
						board.foot.SetFontColor("#AFAFAF");
					}

					board.body
						.SetVisible(true)
						.SetNumLogLines(RecordBoard.NumLogLines)
						.SetPosition(PanelPosition.X+x,size.height-PanelPosition.Y-y)
						.SetString(` ${text}`);
					board.foot
						.SetVisible(false)
						.SetPosition(PanelPosition.X+x+RecordBoard.Size.Width-2,size.height-PanelPosition.Y-y-RecordBoard.Size.Height+2)
						.SetString(`${fmtCount}`);
					board.body.bg.animationDelay	= 0.0;
				});
		})
		.PushUpdatingFunctions(dt=>{
			this.displayBoards.forEach((board,i)=>{
				if(board.body.IsVisible() && !board.body.bg.IsRunningActions())		board.foot.SetVisible(true);
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
					board.body.SetVisible(false).SetIcon(rc.img.achievement);
					board.text.SetVisible(false);
					board.foot.SetVisible(false);

					const handle	= handles.shift();
					if(!handle)	return;

					let datetime	= Store.Select(handle.Key,"");
					board.isUnlocked	= datetime!="";
					if(board.isUnlocked)	datetime	= (new Date(Number(datetime))).toLocaleString();

					let title		= L.Text(handle.Key);
					let text		= "";
					if(!this.isPublic && !handle.IsPublic && !board.isUnlocked){
						title	= L.Text("Achievement.Secret");
						text	= L.Text("Achievement.Secret.Text");
					}
					else if(Array.isArray(handle.Replacements)){
						const repls	= [handle.Count].concat(handle.Replacements).map(r=> _.isNumber(r) ? L.NumToStr(r) : r );
						text	= L.Textf(`${handle.Key}.Text`, repls);
					}
					else{
						text	= L.Text(`${handle.Key}.Text`);
					}

					//アイコン
					board.isPublic	= !!handle.IsPublic;
					board.rank		= handle.Rank || 0;
					board.body.icon.SetCustomData("adjAnim",Math.trunc(Math.random()*8));

					const x	= Math.trunc(i/AchievementBoard.MaxRows) * (AchievementBoard.Size.Width+64) + 64;
					const y	= (i%AchievementBoard.MaxRows) * (AchievementBoard.Size.Height+1);
					board.body.bg.lower			= {width:AchievementBoard.Size.Width, height:AchievementBoard.Size.Height};
					board.body.bg.animationDelay= 0.05*i;
					board.text.fieldWidth		= AchievementBoard.Size.Width;
					if(board.isUnlocked){
						board.body.bg.OPACITY	= 128;
						board.body.iconOpacity	= 255;
						board.body.SetFontColor("#FFCF00","#7F0000",1);
						board.text.SetFontColor("#CFCFCF");
						board.foot.SetFontColor("#FFFFFF");
					}
					else{
						board.body.bg.OPACITY	= 64;
						board.body.iconOpacity	= 128;
						board.body.SetFontColor("#AFAF00","#1F0000",1);
						board.text.SetFontColor("#AFAFAF");
						board.foot.SetFontColor("#AFAFAF");
					}

					board.body
						.SetVisible(true)
						.SetNumLogLines(AchievementBoard.NumLogLines)
						.SetPosition(PanelPosition.X+x,size.height-PanelPosition.Y-y)
						.SetIconIndex( this.GetAchievementIconIndex(board.rank, board.isPublic, board.isUnlocked) )
						.SetString(` ${title}`);
					board.text
						.SetNumLogLines(2)
						.SetPosition(PanelPosition.X+x+2,size.height-PanelPosition.Y-y-14)
						.SetString(text);
					board.foot
						.SetNumLogLines(1)
						.SetPosition(PanelPosition.X+x+AchievementBoard.Size.Width-2,size.height-PanelPosition.Y-y-AchievementBoard.Size.Height+2)
						.SetString(`${datetime}`);
					board.body.bg.animationDelay	= 0.0;
				});

		})
		.PushUpdatingFunctions(dt=>{
			this.displayBoards.forEach((board)=>{
				//出現アニメーションが終わったら連動して内容を表示
				if(board.body.IsVisible() && !board.body.bg.IsRunningActions()){
					board.text.SetVisible(true);
					board.foot.SetVisible(true);
				}

				//アイコン
				if(board.body.IsVisible())	board.body.SetIconIndex( this.GetAchievementIconIndex(board.rank, board.isPublic, board.isUnlocked, board.body.icon.GetCustomData("adjAnim",0)  ));
			});

		});

		//トランジション
		this.Sequences.TRANSITION.PushStartingFunctions(()=>{
			this.displayBoards.forEach(b=>{
				["body","foot","text"].forEach(i=>{
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

	/** 実績アイコンのインデックス
	 * @param {number} rank				実績ランク
	 * @param {boolean} detailIsPublic	シークレット項目ではないなら真
	 * @param {boolean} isUnlocked		解除されているか
	 * @returns {this}
	 */
	GetAchievementIconIndex(rank,detailIsPublic,isUnlocked,adjAnimation=0){
		if(!isUnlocked)	return this.isPublic||detailIsPublic	? 12	: 13;
		rank		=  _(rank).clamp(0,3);
		const cnt	= Math.trunc(this.sequence.count/16+adjAnimation) % 8;
		return rank*3 + [0,0,0,0,0,1,2,1,][cnt];
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
			this.EnableNaviButtons(Achievement.NumPages,Store.NumPages);
			this.pager.SetChapter(this.mode, false);
		}
		return this;
	}
	static get Mode(){
		return {
			Achievements:	0,
			Records:		1,
		};
	}

}//class

})();	//File Scope

