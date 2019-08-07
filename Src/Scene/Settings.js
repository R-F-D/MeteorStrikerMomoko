/* *******************************************************************************
	Settingsシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: "Settings.Main",
};


Scene.Settings	= class extends Scene.SceneBase {

	constructor(){
		super();

		this.Sequences	= {
			INITIAL:	null,	//初期状態
			//
		};

		this.EnableNaviButtons(0);
		this.selector	= new Selector(10);

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

		this.InitUIs();
		return this;
	}

	OnUpdating(dt){
		super.OnUpdating(dt);
		this.selector.Update(dt);
		return this;
	}

	SetSequenceFunctions(){
		const size		= cc.director.getWinSize();

		//初期状態
		this.Sequences.INITIAL.PushStartingFunctions(()=>{
		})
		.PushUpdatingFunctions(dt=>{
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

	OnUiLayerCreate(layer){
		super.InitUIs(layer);
		this.selector.AddToLayer(layer);
		return true;

	}

	/** UIパーツ初期化 */
	InitUIs(){
		super.InitUIs();

		this.selector
			.Init()
			.SetArea(0,288)
			.buttons.forEach((button,i)=>{
				button
					.SetLabelText(`Label\n${i}`);
			});

		return this;
	}

}//class

})();	//File Scope

