/* *******************************************************************************
	Transitionシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: "Transition.Main",
};


Scene.Transition	= class extends Scene.SceneBase {

	constructor(){
		super(true);

		this.Sequences	= {
			INITIAL:	null,	//初期状態
		};
		this._transitionTo	= null;
		this._isTR			= false;

		this.label			= null;

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
					_this.SetBackgroundColor(this,"#000000");
					_this.label	= Label.CreateInstance(14).AddToLayer(this);
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
		super.OnUpdating(dt)
		return this;
	}

	SetSequenceFunctions(){
		const size		= cc.director.getWinSize();

		//初期状態
		this.Sequences.INITIAL.PushStartingFunctions(()=>{
			this.label
				.SetAnchorPoint(cc.p(1,0))
				.SetPosition(size.width-8,4)
				.SetFontColor("#4F4F4F")
				.SetString(L.Text("Transition.Wait"));
		})
		.PushUpdatingFunctions(dt=>{
			if(this.isEnterTransitionFinished && this._transitionTo){
				this.ReplaceScene(this._transitionTo,this._isTR);
				this._transitionTo	= null;
				this._isTR			= false;
			}
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

	SetTransitionTo(scene,isTR=false){
		this._transitionTo	= scene;
		this._isTR	= isTR;
		return this;
	}

}//class

})();	//File Scope

