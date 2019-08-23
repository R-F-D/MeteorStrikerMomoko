/* *******************************************************************************
	Logoシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: "Logo.Main",
};


Scene.Logo	= class extends Scene.SceneBase {

	constructor(){
		super(true);

		this.Sequences	= {
			INITIAL:	null,	//初期状態
			PROCESS:	null,	//メイン処理
		};

		this.sprites	= {};
		this.labels		= {};

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
					_this.SetBackgroundColor(this,"#F0F0F0");
					_this.sprites.devLogo	= Sprite.CreateInstance(rc.img.devLogo).AddToLayer(this);
					_this.labels.toStart	= Label.CreateInstance().SetFontColor("#4F4F4F").AddToLayer(this);
					this.scheduleUpdate();
					return true;
				},
			})
		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット

		this.InitSequences(this.Sequences,LinkedLayerTags.MAIN,this.ccLayerInstances[LinkedLayerTags.MAIN])
			.SetSequence(this.Sequences.INITIAL);

		return this;
	}

	OnUpdating(dt){
		super.OnUpdating(dt);
		return this;
	}

	SetSequenceFunctions(){
		const size		= cc.director.getWinSize();

		//初期状態
		this.Sequences.INITIAL.PushStartingFunctions(()=>{
			this.labels.toStart.SetPosition(size.width/2,size.height/8).SetString(L.Text("Logo.ToStart"));
			this.sprites.devLogo.SetPosition(size.width/2,size.height/2);
		})
		.PushUpdatingFunctions(dt=>{
			if(this.isEnterTransitionFinished)	this.SetSequence(this.Sequences.PROCESS);
		});
		//メイン処理
		this.Sequences.PROCESS.PushStartingFunctions(()=>{
		})
		.PushUpdatingFunctions(dt=>{
		});

		return this;
	}

	InitEventListenerList(){
		super.InitEventListenerList()
			.AddPropertiesToEventListenerList("move",{
				event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesEnded	: (touch,event)=>{
					this.ReplaceScene(Scene.Title);
				},
			})

		//共通イベント対応設定
		let commonEvents	= [];
		commonEvents.push(this.listeners.touched);
		commonEvents.push(this.listeners.keyboardReset);
		this.SetCommonEventListeners("SceneBase.TouchFx",commonEvents);

		//シークエンス-イベント対応設定
		this.Sequences.PROCESS.SetEventListeners(  LinkedLayerTags.MAIN, this.listeners.move);

		return this;
	}

}//class

})();	//File Scope

