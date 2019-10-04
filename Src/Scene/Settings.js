/* *******************************************************************************
	Settingsシーン
********************************************************************************/
var cc,_;
var rc,L;
var Sprite,Store,Locale,Selector;
var Cycle;
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
	PlaysBgm:[
		{	Tag:"0",					OnSelected:Store.Handles.Settings.PlaysBgm,	},
		{	Tag:"1",					OnSelected:Store.Handles.Settings.PlaysBgm,	},
	],
	Navigator:[
		{	Tag:"Normal",				OnSelected:Store.Handles.Settings.Navigator,	},
		{	Tag:"Golem",				OnSelected:Store.Handles.Settings.Navigator,	},
		{	Tag:"Goddess",				OnSelected:Store.Handles.Settings.Navigator,	},
	],
};

/** @const セレクタ領域のマージン */
const SelectorAreaMargin	= {
	left:	16+64,
	top:	16,
};


Scene.Settings	= class extends Scene.SceneBase {

	constructor(){
		super();

		this.Sequences	= {
			INITIAL:	null,	//初期状態
			SELECTORS:	null,	//セレクタ
		};

		this.EnableNaviButtons(0);
		this.selectors	= {
			locale:		new Selector(3),
			playsBgm:	new Selector(2),
			navigator:	new Selector(3),
		};
		_(this.selectors).forEach(s=>s.SetGap(1,32));
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
					_this.sprites.bg	= _.range(2).map(()=> Sprite.CreateInstance(rc.img.bgGround).AddToLayer(this).SetVisible(true) );
					return true;
				},
				update	: function(/*dt*/){
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
		this.selectors.locale.Update(dt);
		this.selectors.playsBgm.Update(dt);
		this.selectors.navigator.Update(dt);
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

	OnUiLayerCreate(layer){
		super.InitUIs(layer);
		this.selectors.locale.AddToLayer(layer);
		this.selectors.playsBgm.AddToLayer(layer);
		this.selectors.navigator.AddToLayer(layer);

		//初回起動時の初期設定
		if(Scene.SceneBase.isFirstBoot && !Scene.SceneBase.initialSettingIsCompleted){
			this.pageNavigator.buttons.at("Reset").OnButtonUp(()=>this.ReplaceScene(Scene.Logo));
			Scene.SceneBase.initialSettingIsCompleted	= true;
		}
		return true;
	}

	/** UIパーツ初期化 */
	InitUIs(){
		super.InitUIs();
		const size	= cc.director.getWinSize();

		const currentSettings	= {
			locale:		L.GetCurrentPresetKey(),
			navigator:	Store.Select(Store.Handles.Settings.Navigator,"0"),
			playsBgm:	Store.Select(Store.Handles.Settings.PlaysBgm, "1"),
		};
		const initialIndexes	= {
			locale:		Number(_(SelectorMaps.Locale   ).findKey(m=> m.Tag==currentSettings.locale)		||0),
			navigator:	Number(_(SelectorMaps.Navigator).findKey(m=> m.Tag==currentSettings.navigator)	||0),
			playsBgm:	Number(_(SelectorMaps.PlaysBgm).findKey(m=> m.Tag==currentSettings.playsBgm)	||0),
		};

		this.selectors.locale
			.Init()
			.SetCaptionByTextCode("Settings.Locale")
			.SetArea(SelectorAreaMargin.left, size.height-(SelectorAreaMargin.top+0))
			.Select(initialIndexes.locale)
			.SetOnSelected((key,tag)=>this.DispatchOnSelect(SelectorMaps.Locale,tag,0))
			.buttons
				.SetTags( ... _(SelectorMaps.Locale).map("Tag") )
				.forEach((b)=> b.SetLabelText(L.Text(`Settings.Locale.Label.${b.tag}`)) );

		this.selectors.playsBgm
				.Init()
				.SetCaptionByTextCode("Settings.PlaysBgm")
				.SetArea(SelectorAreaMargin.left, size.height-(SelectorAreaMargin.top+64))
				.Select(initialIndexes.playsBgm)
				.SetOnSelected((key,tag)=>this.DispatchOnSelect(SelectorMaps.PlaysBgm,tag,0))
				.buttons
					.SetTags( ... _(SelectorMaps.PlaysBgm).map("Tag") )
					.forEach((b)=> b.SetLabelText(L.Text(`Settings.PlaysBgm.Label.${b.tag}`)) );

		this.selectors.navigator
			.Init()
			.SetCaptionByTextCode("Settings.Navigator")
			.SetArea(SelectorAreaMargin.left, size.height-(SelectorAreaMargin.top+128))
			.Select(initialIndexes.navigator)
			.SetOnSelected((key,tag)=>this.DispatchOnSelect(SelectorMaps.Navigator,tag,0))
			.buttons
				.SetTags( ... _(SelectorMaps.Navigator).map("Tag") )
				.forEach((b)=> b.SetLabelText(L.Text(`Settings.Navigator.Label.${b.tag}`)) );

		return this;
	}

	//OnSelectedイベントの発行
	DispatchOnSelect(mappings,tag,idxDefault=null){
		//設定マッピング一覧を走査
		let mapping	= _(mappings).find(m=>tag==m.Tag);
		if(!mapping){
			if(idxDefault===null)	return this;
			else					mapping	= mappings[idxDefault];
		}

		if		(mapping.OnSelected===null)			return this;
		else if	(_.isFunction(mapping.OnSelected))	mapping.OnSelected();
		else										Store.Insert(mapping.OnSelected,mapping.Tag,null);
		return this;
	}

}//class

})();	//File Scope

