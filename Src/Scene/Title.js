/* *******************************************************************************
	Titleシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: "Title.Main",
};

Scene.Title	= class extends Scene.SceneBase {

	Sequences	= {
		/**初期状態*/		INITIAL			: null,
	};

	constructor(){
		super();

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
					_this.sprites.bg		= CreateArray(2).map(i=> Sprite.CreateInstance(rc.img.bg1).AddToLayer(this));
					_this.sprites.logo		= Sprite.CreateInstance(rc.img.logo).AddToLayer(this);
					_this.sprites.player	= Sprite.CreateInstance(rc.img.player).AddToLayer(this);
					_this.flyFx				= Effect.Fly.Create(32).Init(this);
					_this.buttons			= Button.CreateInstance(1).AddToLayer(this);

					return true;
				},
			});
		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット
		this.InitSequences(this.Sequences.INITIAL,this.Sequences,this.ccLayerInstances[LinkedLayerTags.MAIN]);
		this.ApplyCommonEventListeners(this.ccLayerInstances[LinkedLayerTags.MAIN]);	//シークエンス初期化後に共通イベントをセット

		this.buttons.SetPosition(384,128);
		
		this.buttons.at(0)
			.CreateSprite(rc.img.retryButton)
			.OnTouchBegan(()=>this.ReplaceScene(Scene.GamePlay));

		return this;
	}

	OnUpdating(dt){
		super.OnUpdating(dt);

		const width		= cc.director.getWinSize().width;
		const bgWidth	= this.sprites.bg[0].GetPieceSize().width;
		this.sprites.bg.forEach((v,i)=>{
			v.SetPosition(	width /2 - Cycle(this.count*4, 0, bgWidth) + bgWidth*i,	256);
		});

		let adj	= {	x:this.sprites.player.GetCustomData("adj.x",-100),	//修正
					y:this.sprites.player.GetCustomData("adj.y",+100)};
		let d	= { x:this.sprites.player.GetCustomData("dx",  +1),		//増分
					y:this.sprites.player.GetCustomData("dy",  -1)};
		d.x	= Math.max(0,d.x*0.99);
		adj.x += d.x;
		d.y += adj.y < 0	? 0.01	: -0.01;
		if     (d.y <-0.99) d.y = MoveTo(d.y,-0.99,0.01);
		else if(d.y > 0.99) d.y = MoveTo(d.y, 0.99,0.01);
		adj.y += d.y;
		
		let idx	= this.count%128<16 ? 6 : 4;
		if(Math.trunc(this.count/8)%2)	++idx;

		this.sprites.player
			.SetIndex(idx)
			.SetPosition(128+adj.x,80+adj.y)
			.SetCustomData("adj.x",adj.x).SetCustomData("adj.y",adj.y).SetCustomData("dx",d.x).SetCustomData("dy",d.y);
		this.flyFx.Spawn(this.sprites.player.x-16,this.sprites.player.y-8).Update();

		return this;
	}

	SetSequenceFunctions(){
		const size		= cc.director.getWinSize();

		//初期状態
		this.Sequences.INITIAL.PushStartingFunctions(()=>{			
			this.sprites.bg.forEach(v=>v.SetVisible(true));
			this.sprites.logo
				.SetScale(1).Attr({zIndex:10}).SetPositionLT(0,size.height);
			this.sprites.player
				.SetScale(0).Attr({zIndex:5}).SetRotate(-5)
				.SetCustomData("adj.x").SetCustomData("adj.y").SetCustomData("dx").SetCustomData("dy")
				.RunAction(cc.ScaleTo.create(10,2).easing(cc.easeBackOut(10)));
			this.flyFx
				.SetVelocity(1,-0.5,-0.5,0);;
		})
		.PushUpdatingFunctions((dt)=>{
		});

		return this;
	}

	InitEventListenerList(){
		super.InitEventListenerList()
			/** 次フェイズへの単純遷移 */
			.AddPropertiesToEventListenerList("toGamePlay",{
				event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesBegan	: (touch,event)=>{
					this.ReplaceScene(Scene.GamePlay);
					return true;
				},
			})
			//シェアボタン
			.AddToEventListenerList("shareButton",(sender,type)=>{
				if      (type===ccui.Widget.TOUCH_BEGAN){
				}
				else if (type===ccui.Widget.TOUCH_ENDED){
					cc.sys.openURL( L.Textf("GamePlay.Share.Format",[
										L.Textf("GamePlay.Share.Text",	[ L.NumToStr(this.GetDistanceInKm()),	L.Text("GamePlay.Distance.Unit"), ]),
										L.Text("GamePlay.Share.URL"),
										L.Text("GamePlay.Share.Tags")
									]));
				}
				else if (type===ccui.Widget.TOUCH_CANCELED){
				}
				return true;
			});

		//共通イベント対応設定
		let commonEvents	= [];
		commonEvents.push(this.listeners.touched);
		Debug(()=>{
			//commonEvents.push(this.listeners.reset);
		});
		this.SetCommonEventListeners(commonEvents);

		//シークエンス-イベント対応設定
		//this.Sequences.INITIAL.SetEventListeners(		this.listeners.toGamePlay	).NextPhase(this.Sequences.START_AIM);

		return this;
	}

}//class

})();	//File Scope

