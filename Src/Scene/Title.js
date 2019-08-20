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
			INITIAL	: null,	//初期状態
			PROCESS	: null,	//メイン処理
		};

		/** ccSceneのインスタンス */
		this.ApplicateCcSceneInstance(this).InitLayerList();

		this.playerIsTouched	= false;

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
					_this.sprites.bg			= CreateArray(2).map(i=> Sprite.CreateInstance(rc.img.bgGround).AddToLayer(this));
					_this.sprites.logo			= Sprite.CreateInstance(rc.img.logo).AddToLayer(this);
					_this.sprites.player		= Sprite.CreateInstance(rc.img.player).AddToLayer(this);
					_this.sprites.balloonTail	= Sprite.CreateInstance(rc.img.balloonTail).AddToLayer(this);
					_this.flyFx					= Effect.Fly.Create(32).Init(this);
					_this.label					= Label.CreateInstance(12,rc.font.talk).AddToLayer(this);
					return true;
				},
			})
			.AddToLayerList("ui",{
				ctor:function(){
					this._super();
					this.scheduleUpdate();
					_this.buttons			= Button.CreateInstance(6).AddToLayer(this).SetTags("Play","Achievements","Records","Credits","Settings","Help");
					return true;
				},
			});
		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.SetLayer(LinkedLayerTags.UI,  this.ccLayers.ui,0x0002)
			.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット

		this.InitSequences(this.Sequences,LinkedLayerTags.MAIN,this.ccLayerInstances[LinkedLayerTags.MAIN])
			.SetSequence(this.Sequences.INITIAL);

		this.InitUIs();
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
			.SetCustomData("adj.x",adj.x).SetCustomData("adj.y",adj.y).SetCustomData("dx",d.x).SetCustomData("dy",d.y);``
		this.flyFx.Spawn(this.sprites.player.x-16,this.sprites.player.y-8).Update();

		//フキダシ
		if(this.label.IsVisible()){
			this.label
				.SetPosition(this.sprites.player.x+40,this.sprites.player.y+32)
				.Update(dt);
		}
		if(this.label.IsDisplayed() && !this.label.bg.IsRunningActions()){
			const bg	= this.label.bg;
			const bg_h	= bg.imgHeight * bg.entity.getScaleY();
			this.sprites.balloonTail
				.SetPosition( bg.entity.x-4, bg.entity.y - (bg_h+this.sprites.balloonTail.img.height)/2 )
				.SetVisible(true);
		}
		else{
			this.sprites.balloonTail.SetVisible(false);
		}

		this.buttons.Update(dt);
		return this;
	}

	SetSequenceFunctions(){
		const size		= cc.director.getWinSize();

		//初期状態
		this.Sequences.INITIAL
			.PushStartingFunctions(()=>{
				this.sprites.bg.forEach(v=>v.SetVisible(true));
				this.sprites.logo
					.SetScale(1).Attr({zIndex:10}).SetPositionLT(0,size.height);
				this.sprites.player
					.SetScale(0).Attr({zIndex:5})
					.SetCustomData("adj.x").SetCustomData("adj.y").SetCustomData("dx").SetCustomData("dy")
					.RunActions(cc.scaleTo(10,2).easing(cc.easeBackOut(10)));
				this.flyFx
					.SetVelocity(1,-0.5,-0.5,0);

				//フキダシ
				this.sprites.balloonTail.SetColor(this.label.bg.COLOR).SetOpacity(this.label.bg.OPACITY)
				this.label
					.Init().SetVisible(false).SetBgEnabled(true).SetNumLogLines(1);
				this.playerIsTouched	= false;
			})
			.PushUpdatingFunctions(dt=>{
				if(this.sequence.count>60)	this.SetSequence(this.Sequences.PROCESS);
			});
		//メイン処理
		this.Sequences.PROCESS
			.PushStartingFunctions(()=>{
				this.label.SetVisible(true);
			})
			.PushUpdatingFunctions(dt=>{
			});

		return this;
	}

	InitEventListenerList(){
		super.InitEventListenerList()
		.AddPropertiesToEventListenerList("reactions",{
			event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
			onTouchesBegan	: (touches,event)=>{
				touches.forEach(touch=>{
					const location		= touch.getLocation();

					//プレイヤーキャラクターをタッチ
					if((location.x-this.sprites.player.x)**2 + (location.y-this.sprites.player.y)**2 <32**2){
						this.label.PushLog(L.Text("Title.Reaction.Player"));
						if(!this.playerIsTouched){
							const nTouches	= Store.DynamicInsert(Store.Handles.Action.NumTouchesPlayer);
							Achievement.Unlock(Achievements.Action.TouchPlayer,nTouches);
						}
						this.playerIsTouched	= true;
					}
				});
				return true;
			},
		});

		//共通イベント対応設定
		let commonEvents	= [];
		commonEvents.push(this.listeners.touched);
		commonEvents.push(this.listeners.keyboardReset);
		this.SetCommonEventListeners("SceneBase.TouchFx",commonEvents);

		//シークエンス-イベント対応設定
		this.Sequences.PROCESS.SetEventListeners(  LinkedLayerTags.MAIN, this.listeners.reactions		);

		return this;
	}


	/** UIパーツ初期化 */
	InitUIs(){
		super.InitUIs();

		//ボタン共通
		this.buttons
			.SetPosition(384,128)
			.forEach((button)=>{
				button.OnMouseHover(
					()=>this.label.PushLog(L.Text(`Title.Button.${button.tag}`))
				);
			});

		//Play
		this.buttons.at("Play")
			.CreateSprite(rc.img.titleButton)
			.SetScale(1)
			.SetIndex(1).SetIndex(Button.OFF,0)
			.OnButtonUp(()=>this.ReplaceScene(Scene.Transition).SetTransitionTo(Scene.GamePlay))
			.AssignKeyboard(cc.KEY["0"], cc.KEY.p, cc.KEY.space, cc.KEY.enter);

		//Play以外
		this.buttons.filter(v=> v.tag!="Play" ).forEach((button,i)=>{
			button
				.CreateSprite(rc.img.titleButton)
				.SetPosition(null,null,(0.3-0.2*i)*Math.PI,96)
				.SetScale(0.5)
				.SetIndex(i*2+3).SetIndex(Button.OFF,i*2+2)
				.AssignKeyboard(cc.KEY["1"]+i);
		});

		this.buttons.at("Achievements").OnButtonUp(()=>this.ReplaceScene(Scene.Records).SetMode(Scene.Records.Mode.Achievements));
		this.buttons.at("Records").OnButtonUp(()=>this.ReplaceScene(Scene.Records).SetMode(Scene.Records.Mode.Records));
		this.buttons.at("Settings").OnButtonUp(()=>this.ReplaceScene(Scene.Settings));
		this.buttons.at("Help").OnButtonUp(()=>this.ReplaceScene(Scene.Help));
		this.buttons.at("Credits").OnButtonUp(()=> cc.sys.openURL(C.WebPage) );

		return this;
	}


}//class

})();	//File Scope

