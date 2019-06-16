/* *******************************************************************************
	Titleシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: "Title.Main",
	UI		: "Title.Ui",
};


Scene.Title	= class extends Scene.SceneBase {

	constructor(){
		super();

		this.Sequences	= {
			/**初期状態*/		INITIAL			: null,
		};

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
					_this.sprites.bg		= CreateArray(2).map(i=> Sprite.CreateInstance(rc.img.bgGround).AddToLayer(this));
					_this.sprites.logo		= Sprite.CreateInstance(rc.img.logo).AddToLayer(this);
					_this.sprites.player	= Sprite.CreateInstance(rc.img.player).AddToLayer(this);
					_this.flyFx				= Effect.Fly.Create(32).Init(this);
					return true;
				},
			})
			.AddToLayerList("ui",{
				ctor:function(){
					this._super();
					this.scheduleUpdate();
					_this.buttons			= Button.CreateInstance(6).AddToLayer(this).SetTags(["Play","Score","Help","Settings","WebPage","Credits",]);
					return true;
				},
			});
		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.SetLayer(LinkedLayerTags.UI,  this.ccLayers.ui,0x0002)
			.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット

		this.InitSequences(this.Sequences,this.ccLayerInstances[LinkedLayerTags.MAIN])
			.SetSequence(this.Sequences.INITIAL);

		//ボタン
		this.buttons.SetPosition(384,128);
		this.buttons.at("Play")
			.CreateSprite(rc.img.titleButton)
			.SetScale(1)
			.SetIndex(Button.OFF,  0)
			.SetIndex(Button.ON,   1)
			.SetIndex(Button.HOVER,1)
			.OnButtonUp(()=>this.ReplaceScene(Scene.GamePlay));
		this.buttons.filter(v=> v.tag!="Play" ).forEach((button,i)=>{
			button
				.CreateSprite(rc.img.titleButton)
				.SetPosition(null,null,(0.3-0.2*i)*Math.PI,96)
				.SetScale(0.5)
				.SetIndex(Button.OFF,  i*2+2)
				.SetIndex(Button.ON,   i*2+3)
				.SetIndex(Button.HOVER,i*2+3);
		});
		this.buttons.at("Help").OnButtonUp(()=>this.ReplaceScene(Scene.Text));
		this.buttons.at("WebPage").OnButtonUp(()=> cc.sys.openURL(L.Text("GamePlay.Share.URL")) );

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

		this.buttons.Update(dt);
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
				.SetScale(0).Attr({zIndex:5})
				.SetCustomData("adj.x").SetCustomData("adj.y").SetCustomData("dx").SetCustomData("dy")
				.RunActions(cc.scaleTo(10,2).easing(cc.easeBackOut(10)));
			this.flyFx
				.SetVelocity(1,-0.5,-0.5,0);;
		})
		.PushUpdatingFunctions(dt=>{
		});

		return this;
	}

	InitEventListenerList(){
		super.InitEventListenerList()
			/** ゲームプレイシーンへ遷移 */
			.AddPropertiesToEventListenerList("toGamePlay",{
				event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesBegan	: (touch,event)=>{
					this.ReplaceScene(Scene.GamePlay);
					return true;
				},
			})
			/*
			//シェアボタン
			.AddToEventListenerList("shareGameButton",(sender,type)=>{
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
			})*/
			;

		//共通イベント対応設定
		let commonEvents	= [];
		commonEvents.push(this.listeners.touched);
		Debug(()=>{
			//commonEvents.push(this.listeners.reset);
		});
		this.SetCommonEventListeners("SceneBase.TouchFx",commonEvents);

		return this;
	}

}//class

})();	//File Scope

