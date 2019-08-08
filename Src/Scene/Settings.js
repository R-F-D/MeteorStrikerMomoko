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
		};

		this.EnableNaviButtons(0);
		this.selector	= new Selector(3);
		this.selector.gap	= 32;

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
		const size	= cc.director.getWinSize();

		let initialIndex	= 0;
		if		(L.language=="en"&&L.numericSeparation=="en")	initialIndex=1;
		else if	(L.language=="ja"&&L.numericSeparation=="ja")	initialIndex=2;

		this.selector
			.Init()
			.SetArea(64,size.height-64)
			.Select(initialIndex)
			.buttons
				.SetTags("_","en","ja",)
				.forEach((b,i)=> b.SetLabelText(b.tag) );

		this.selector.OnSelected	= (ley,tag)=>{
			if		(tag=="_")	{	L.language="_";		L.numericSeparation="_";	L.Save();	}
			else if	(tag=="en")	{	L.language="en";	L.numericSeparation="en";	L.Save();	}
			else if	(tag=="ja")	{	L.language="ja";	L.numericSeparation="ja";	L.Save();	}
		};

		return this;
	}

}//class

})();	//File Scope

