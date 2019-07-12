/* *******************************************************************************
	Recordsシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN:	"Records.Main",
	BG:		"Records.Bg",
	UI:		"Records.Ui",
};

const PanelPosition		= {X:96,Y:240};
const MaxDisplayBoards	= 14;
const DisplayBoardSize	= {Width:160,Height:32};


Scene.Records	= class extends Scene.SceneBase {

	constructor(){
		super();

		this.Sequences	= {
			INITIAL:		null,	//初期状態
			RECORDS:		null,	//記録一覧
			ACHIEVEMENTS:	null,	//実績一覧
			TRANSITION:		null,	//トランジション用
		};

		this.sprites		= {};
		this.buttons		= {};
		this.displayBoards	= [];	//表示板
		this.page			= 0;

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
					_this.displayBoards	= _.range(MaxDisplayBoards).map( h=>	{
						const body		= Label.CreateInstance( 9).AddToLayer(this).SetBgEnabled(true).SetAnchorPoint(0.0, 0.5).SetColor("#FFFF00");
						const counter	= Label.CreateInstance(11).AddToLayer(this).SetAnchorPoint(1.0, 0.5).SetColor("#FFFFFF");
						body.bg.easeFunc	= ()=>cc.easeElasticOut(10);
						return {body:body,counter:counter};
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
			.AddToLayerList("ui",{
				ctor:function(){
					this._super();
					this.scheduleUpdate();

					//ボタン
					_this.buttons	= Button.CreateInstance(1).AddToLayer(this);
					_this.buttons.at(0).CreateSprite(rc.img.navigationButton).SetTag("Reset");

					return true;
				},
				update	: function(dt){
					this._super();
					_this.buttons.Update(dt);
					_this.sequence.Update(dt,"layer-ui");
				},
			});
		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.SetLayer(LinkedLayerTags.UI,  this.ccLayers.ui,  0x0002)
			.SetLayer(LinkedLayerTags.BG,  this.ccLayers.bg,  0x0000)
			.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット

		this.InitSequences(this.Sequences,LinkedLayerTags.MAIN,this.ccLayerInstances[LinkedLayerTags.MAIN])
			.SetSequence(this.Sequences.INITIAL);

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
				.forEach(board=> board.body.Init().SetNumLogLines(2) );

			//インタフェース
			this.buttons.at("Reset")
				.SetVisible(true)
				.SetPosition(16,size.height-16)
				.SetColorOnHover([0xFF,0xA0,0x00])
				.OnButtonUp(()=>this.ResetForce());
		})
		.PushUpdatingFunctions(dt=>{
			 if(this.sequence.count>=60) this.SetSequence(this.Sequences.RECORDS);
		});
		//スコア表示
		this.Sequences.RECORDS.PushStartingFunctions(()=>{

			let handles	= Store.GetVisibleHandles(this.page||0);

			//ラベル
			this.displayBoards
				.forEach((board,i)=>{
					const handle	= handles.shift();
					if(!handle){
						board.body.SetVisible(false);
						board.counter.SetVisible(false);
						return;
					}

					//カウンタ
					let count	= Store.Select(handle.Key,0);
					if(handle.Conv)	count = handle.Conv(count);
					count		= L.NumToStr(count, handle.nDecimalDigits);

					let patterns	= [count];
					if(L.TextExists(handle.UnitKey))	patterns.push(L.Text(handle.UnitKey));
					let fmtCount	= "";
					if(handle.Required!==null && handle.Required<=count)	fmtCount	= L.TextExists(`Records.${handle.Key}.Format`) ? L.Textf( `Records.${handle.Key}.Format`,patterns) : L.Textf("Unit.Counter",patterns);
					else													fmtCount	= L.Text("Records.Secret.Format");

					//ヘッダ
					const text		= handle.Required!==null && handle.Required<=count	? L.Text(`Records.${handle.Key}`) : L.Text("Records.Secret");

					const x	= (i%2) * (DisplayBoardSize.Width+4);
					const y	= Math.trunc(i/2) * (DisplayBoardSize.Height+4);
					board.body.bg.lower			= {width:DisplayBoardSize.Width, height:DisplayBoardSize.Height};
					board.body.bg.animationDelay	= 0.05*i;
					board.body
						.SetVisible(true)
						.SetPosition(PanelPosition.X+x,PanelPosition.Y-y)
						.SetString(` ${text}`);
					board.counter
						.SetVisible(false)
						.SetPosition(PanelPosition.X+x+DisplayBoardSize.Width-2,PanelPosition.Y-y-6)
						.SetString(`${fmtCount}`);
						board.body.bg.animationDelay	= 0.0;
				});
		})
		.PushUpdatingFunctions(dt=>{
			this.displayBoards.forEach((board,i)=>{
				if(board.body.IsVisible() && !board.body.bg.IsRunningActions())		board.counter.SetVisible(true);
			});

			if(this.sequence.count>60*5)	this.SetSequence(this.Sequences.TRANSITION);
		});
		//トランジション
		this.Sequences.TRANSITION.PushStartingFunctions(()=>{
			this.displayBoards.forEach(b=>{
				if(b.body.IsVisible())	b.body.RemoveString(false);
				if(b.counter.IsVisible())	b.counter.RemoveString(false);
			});
		})
		.PushUpdatingFunctions(dt=>{
			if( _(this.displayBoards).every(b=>!b.body.IsVisible() || !b.body.bg.IsRunningActions()) ){
				if(++this.page>1) this.page=0;
				this.SetSequence(this.Sequences.RECORDS);
			}
		});
		return this;
	}

	InitEventListenerList(){
		super.InitEventListenerList();

		//共通イベント対応設定
		let commonEvents	= [];
		commonEvents.push(this.listeners.touched);
		Debug(()=>commonEvents.push(this.listeners.reset));
		this.SetCommonEventListeners("SceneBase.TouchFx",commonEvents);

		return this;
	}

}//class

})();	//File Scope

