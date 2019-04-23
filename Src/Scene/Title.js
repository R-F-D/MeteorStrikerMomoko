/* *******************************************************************************
	Titleシーン
********************************************************************************/
var Scenes	= Scenes || {};
(function(){	//File Scope

/** classへのthis */
let _this	= null;

/** シークエンス列挙型 */
let Sequences	= {
	/**初期状態*/		INITIAL			: null,
};


Scenes.Title	= class extends Scenes.SceneBase {

	constructor(){
		super();
		_this	= this;

		/** ccSceneのインスタンス */
		this.ApplicateCcSceneInstance(this).InitLayerList();

		//シークエンス設定
		for(let i in Sequences){ Sequences[i] = Sequence.Create() }
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
					return true;
				},
				update	: function(dt){
					this._super();
					return true;
				},
			});
		return this;
	}

}//class

})();	//File Scope

