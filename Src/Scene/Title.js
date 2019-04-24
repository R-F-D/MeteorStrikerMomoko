/* *******************************************************************************
	Titleシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** classへのthis */
let _this	= null;

/** シークエンス列挙型 */
let Sequences	= {
	/**初期状態*/		INITIAL			: null,
};
/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: "Title.Main",
};

Scene.Title	= class extends Scene.SceneBase {

	constructor(){
		super();
		_this	= this;

		/** ccSceneのインスタンス */
		this.ApplicateCcSceneInstance(this).InitLayerList();

		//シークエンス設定
		for(let i in Sequences){ Sequences[i] = Scene.Sequence.Create() }
		this.SetSequenceFunctions().InitEventListenerList();
	}


	/** ccLayerに渡す用 */
	InitLayerList(){
		super.InitLayerList()
			.AddToLayerList("main",{
				ctor:function(){
					this._super();
					this.init();
					this.scheduleUpdate();
					return true;
				},
				init	: function(){
					this._super();
					const size	= cc.director.getWinSize();
					_this.sprites.bg		= CreateArray(2).map(i=> Sprite.CreateInstance(rc.img.bg1).AddToLayer(this).SetVisible(true)	);
					_this.sprites.logo		= Sprite.CreateInstance(rc.img.logo).AddToLayer(this).SetScale(1).Attr({zIndex:10}).SetPositionLT(0,size.height);
					_this.sprites.player	= Sprite.CreateInstance(rc.img.player).AddToLayer(this)
												.SetScale(0).Attr({zIndex:5}).SetRotate(-5)
												.SetCustomData("adj.x").SetCustomData("adj.y").SetCustomData("dx").SetCustomData("dy")
												.RunAction(cc.ScaleTo.create(10,2).easing(cc.easeBackOut(10)));
					_this.flyFx				= Effect.Fly.Create(32).Init(this).SetVelocity(1,-0.5,-0.5,0);;
					return true;
				},
				update	: function(dt){
					this._super();

					const width		= cc.director.getWinSize().width;
					const bgWidth	= _this.sprites.bg[0].GetPieceSize().width;
					_this.sprites.bg.forEach((v,i)=>{
						v.SetPosition(	width /2 - Cycle(_this.count*4, 0, bgWidth) + bgWidth*i,	256);
					});

					let adj	= {	x:_this.sprites.player.GetCustomData("adj.x",-100),	//修正
								y:_this.sprites.player.GetCustomData("adj.y",+100)};	//修正
					let d	= { x:_this.sprites.player.GetCustomData("dx",  +1),	//増分
								y:_this.sprites.player.GetCustomData("dy",  -1)};	//増分
					d.x	= Math.max(0,d.x*0.99);
					adj.x += d.x;
					d.y += adj.y < 0	? 0.01	: -0.01;
					if     (d.y <-0.99) d.y = MoveTo(d.y,-0.99,0.01);
					else if(d.y > 0.99) d.y = MoveTo(d.y, 0.99,0.01);
					adj.y += d.y;
					
					_this.sprites.player
						.SetIndex(Math.trunc(_this.count/8)%2+4)
						.SetPosition(128+adj.x,80+adj.y)
						.SetCustomData("adj.x",adj.x).SetCustomData("adj.y",adj.y).SetCustomData("dx",d.x).SetCustomData("dy",d.y);

					_this.flyFx.Spawn(_this.sprites.player.x-16,_this.sprites.player.y-8).Update();

					_this.fx.touched.Update();
					return true;
				},
			});
		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット
		this.InitSequence(Sequences.INITIAL,Sequences,this.ccLayerInstances[LinkedLayerTags.MAIN]);
		this.sequence.Init()
		return this;
	}

	InitEventListenerList(){
		super.InitEventListenerList()
			/** 次フェイズへの単純遷移 */
			.AddPropertiesToEventListenerList("toGamePlay",{
				event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesBegan	: (touch,event)=>{
					cc.director.runScene(Scene.GamePlay.Create().GetCcSceneInstance());
					return true;
				},
			})
		//共通イベント対応設定
		let commonEvents	= [];
		commonEvents.push(this.listeners.touched);
		Debug(()=>{
			//commonEvents.push(this.listeners.reset);
		});
		Scene.Sequence.SetCommonEventListeners(commonEvents);

		//シークエンス-イベント対応設定
		Sequences.INITIAL.SetEventListeners(		this.listeners.toGamePlay	).NextPhase(Sequences.START_AIM);

		return this;
	}

}//class

})();	//File Scope

