/* *******************************************************************************
	Settingsシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN:	"Settings.Main",
	BG:		"Settings.Bg",
};

/** 選択肢マッピング */
const SelectorMaps	= {
	Locale:[
		{	Tag:Locale.UniversalCode,	OnSelected:()=>{L.ApplyPreset(Locale.UniversalCode)},	},
		{	Tag:"en",					OnSelected:()=>{L.ApplyPreset("en")},					},
		{	Tag:"ja",					OnSelected:()=>{L.ApplyPreset("ja")},					},
	],
};


Scene.Settings	= class extends Scene.SceneBase {

	constructor(){
		super();

		this.Sequences	= {
			INITIAL:	null,	//初期状態
			SELECTORS:	null,	//セレクタ
		};

		this.EnableNaviButtons(0);
		this.selector	= new Selector(3);
		this.selector.gap	= 32;
		this.sprites		= {};

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
			.AddToLayerList("bg",{
				ctor:function(){
					this._super();
					this.scheduleUpdate();
					_this.sprites.bg	= _.range(2).map(i=> Sprite.CreateInstance(rc.img.bgGround).AddToLayer(this).SetVisible(true) );
					return true;
				},
				update	: function(dt){
					this._super();
					const width		= cc.director.getWinSize().width;
					const bgWidth	= _this.sprites.bg[0].GetPieceSize().width;
					_this.sprites.bg.forEach((v,i)=>v.SetPosition(	width /2 - Cycle(_this.count, 0, bgWidth) + bgWidth*i,	256) );
				},
			})
		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.SetLayer(LinkedLayerTags.BG,  this.ccLayers.bg,  0x0000)
			.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット

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

		const initialIndexes	= {
			locale:	Number(_(SelectorMaps.Locale).findKey(m=>	m.Tag==L.GetCurrentPresetKey()	)),
		};

		this.selector
			.Init()
			.SetCaptionByTextCode("Settings.Locale")
			.SetArea(64,size.height-32)
			.Select(initialIndexes.locale)
			.SetOnSelected((key,tag)=>{
				const mapping	= _(SelectorMaps.Locale).find(m=>tag==m.Tag);
				L.ApplyPreset( mapping ? mapping.Tag : Locale.UniversalCode );
			})
			.buttons
				.SetTags( ... _(SelectorMaps.Locale).map("Tag") )
				.forEach((b,i)=> b.SetLabelText(L.Text(`Settings.Locale.Label.${b.tag}`)) );

		return this;
	}

}//class

})();	//File Scope

