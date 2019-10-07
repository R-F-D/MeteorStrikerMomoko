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
	BgmVolume:[
		{	Tag:"0",					OnSelected:Store.Handles.Settings.BgmVolume,	},
		{	Tag:"1",					OnSelected:Store.Handles.Settings.BgmVolume,	},
		{	Tag:"2",					OnSelected:Store.Handles.Settings.BgmVolume,	},
		{	Tag:"3",					OnSelected:Store.Handles.Settings.BgmVolume,	},
		{	Tag:"4",					OnSelected:Store.Handles.Settings.BgmVolume,	},
		{	Tag:"5",					OnSelected:Store.Handles.Settings.BgmVolume,	},
	],
	Meteorite:[
		{	Tag:"Normal",				OnSelected:Store.Handles.Settings.Meteorite,	},
		{	Tag:"Tryangle",				OnSelected:Store.Handles.Settings.Meteorite,	},
	],
	Navigator:[
		{	Tag:"Normal",				OnSelected:Store.Handles.Settings.Navigator,	},
		{	Tag:"Golem",				OnSelected:Store.Handles.Settings.Navigator,	},
		{	Tag:"Goddess",				OnSelected:Store.Handles.Settings.Navigator,	},
	],
};

const PageMaps	= [
	[	"Locale","BgmVolume",	],
	[	"Meteorite","Navigator",],
];

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
			TRANSITION:	null,
		};

		this.EnableNaviButtons(0);
		this.selectors	= {
			Locale:		new Selector(3),
			BgmVolume:	new Selector(6),
			Meteorite:	new Selector(2),
			Navigator:	new Selector(3),
		};
		_(this.selectors).forEach(s=>s.SetGap(0,32));
		this.sprites		= {};

		this.EnableNaviButtons(PageMaps.length);
		if(this.pager)	this.pager.SetChapter(0, false);

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

		if(this.pager)	this.pager.onPageChanged	= ()=> this.SetSequence(this.Sequences.TRANSITION);

		this.InitUIs();
		return this;
	}

	OnUpdating(dt){
		super.OnUpdating(dt);
		_(this.selectors).forEach(s=>s.Update(dt));
		return this;
	}

	SetSequenceFunctions(){
		//初期状態
		this.Sequences.INITIAL.PushStartingFunctions(()=>{
		})
		.PushUpdatingFunctions((/*dt*/)=>{
			if(this.isEnterTransitionFinished)	this.SetSequence(this.Sequences.SELECTORS);
		});
		//セレクタ表示
		this.Sequences.SELECTORS.PushStartingFunctions(()=>{
			const page	= this.pager ? this.pager.GetPage() : 0;
			this.DeploySelectors(page);
		})
		.PushUpdatingFunctions((/*dt*/)=>{
		});
		//セレクタ消去
		this.Sequences.TRANSITION.PushStartingFunctions(()=>{
			_(this.selectors).forEach(s=>s.SetVisible(false))
		})
		.PushUpdatingFunctions((/*dt*/)=>{
			this.SetSequence(this.Sequences.SELECTORS);
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
		_(this.selectors).forEach(s=>s.AddToLayer(layer));

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

		const currentSettings	= {
			Locale:		L.GetCurrentPresetKey(),
			BgmVolume:	Store.Select(Store.Handles.Settings.BgmVolume,"1"),
			Navigator:	Store.Select(Store.Handles.Settings.Navigator,"0"),
			Meteorite:	Store.Select(Store.Handles.Settings.Meteorite,"0"),
		};
		const initialIndexes	= {
			Locale:		Number(_(SelectorMaps.Locale   ).findKey(m=> m.Tag==currentSettings.Locale)		||0),
			BgmVolume:	Number(_(SelectorMaps.BgmVolume).findKey(m=> m.Tag==currentSettings.BgmVolume)	||0),
			Navigator:	Number(_(SelectorMaps.Navigator).findKey(m=> m.Tag==currentSettings.Navigator)	||0),
			Meteorite:	Number(_(SelectorMaps.Meteorite).findKey(m=> m.Tag==currentSettings.Meteorite)	||0),
		};

		_(this.selectors).forEach((selector,item)=>{
			selector
				.Init()
				.SetVisible(false)
				.SetCaptionByTextCode(`Settings.${item}`)
				.Select(initialIndexes[item])
				.SetOnSelected((key,tag)=>{
					this.DispatchOnSelect(SelectorMaps[item],tag,0)
				})
				.buttons
					.SetTags( ... _(SelectorMaps[item]).map("Tag") )
					.forEach((b)=> b.SetLabelText(L.Text(`Settings.${item}.Label.${b.tag}`)) );
		});

		return this;
	}

	DeploySelectors(page){
		const size	= cc.director.getWinSize();

		_(this.selectors).forEach(s=>s.SetVisible(false));
		PageMaps[page].forEach((item,i)=>{
			const selector	= this.selectors[item];
			if(!selector)	return;

			selector
				.SetVisible(true)
				.SetArea(	SelectorAreaMargin.left,
							size.height - (SelectorAreaMargin.top+i*64)	);
		});
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

