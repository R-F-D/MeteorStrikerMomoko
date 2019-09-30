/* *******************************************************************************
	Helpシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: "Help.Main",
};


Scene.Help	= class extends Scene.SceneBase {

	constructor(){
		super();

		this.Sequences	= {
			INITIAL:	null,	//初期状態
			//
		};

		this.EnableNaviButtons(0);
		this.buttons	= {};

		/** ccSceneのインスタンス */
		this.ApplicateCcSceneInstance(this).InitLayerList();

		//シークエンス設定
		for(let i in this.Sequences){ this.Sequences[i] = Scene.Sequence.Create() }
		this.SetSequenceFunctions().InitEventListenerList();
	}


	/** ccLayerに渡す用 */
	InitLayerList(){
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

		return this;
	}

	OnUpdating(dt){
		super.OnUpdating(dt);
		return this;
	}

	SetSequenceFunctions(){

		//初期状態
		this.Sequences.INITIAL.PushStartingFunctions(()=>{
		})
		.PushUpdatingFunctions((/*dt*/)=>{
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

}//class

})();	//File Scope

