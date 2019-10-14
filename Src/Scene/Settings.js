/* *******************************************************************************
	Settingsシーン
********************************************************************************/
var cc,_;
var rc,L;
var Sprite,Store,Achievement,Locale,Selector;
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
	SfxVolume:[
		{	Tag:"0",					OnSelected:Store.Handles.Settings.SfxVolume,	},
		{	Tag:"1",					OnSelected:Store.Handles.Settings.SfxVolume,	},
		{	Tag:"2",					OnSelected:Store.Handles.Settings.SfxVolume,	},
		{	Tag:"3",					OnSelected:Store.Handles.Settings.SfxVolume,	},
		{	Tag:"4",					OnSelected:Store.Handles.Settings.SfxVolume,	},
		{	Tag:"5",					OnSelected:Store.Handles.Settings.SfxVolume,	},
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
	Storage:[
		{	Tag:"RemoveSettings",		OnSelected:()=> Scene.Settings.RemoveStorageData( "RemoveSettings",		true,false,false),	},
		{	Tag:"RemoveRecords",		OnSelected:()=> Scene.Settings.RemoveStorageData( "RemoveRecords",		false,true,false),	},
		{	Tag:"RemoveAchievements",	OnSelected:()=> Scene.Settings.RemoveStorageData( "RemoveAchievements",	false,false,true),	},
		{	Tag:"Remove",				OnSelected:()=> Scene.Settings.RemoveStorageData( "Remove",				true,true,true),	},
	],
};

const PageMaps	= {
	Locale:		{	Order:0,	KeepsOn:true,	IsEnabled:true,		},
	SfxVolume:	{	Order:0,	KeepsOn:true,	IsEnabled:true,		},
	BgmVolume:	{	Order:0,	KeepsOn:true,	IsEnabled:true,		},
	Meteorite:	{	Order:1,	KeepsOn:true,	IsEnabled:false,	},
	Navigator:	{	Order:1,	KeepsOn:true,	IsEnabled:false,	},
	Storage:	{	Order:2,	KeepsOn:false,	IsEnabled:true,		},
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
			TRANSITION:	null,
		};

		this.EnableNaviButtons(0);
		this.selectors	= {};
		_(SelectorMaps).forEach((sm,tag)=>this.selectors[tag]	= new Selector(sm.length));
		_(this.selectors).forEach(s=>s.SetGap(0,32));
		this.sprites		= {};

		this.lockPanel	= null;

		this.EnableNaviButtons( _(PageMaps).reduce((result,pm)=>Math.max(result,pm.Order),0)+1 );
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
		this.lockPanel	= new LockPanel(layer,3);
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

		_(this.selectors).forEach((selector,tag)=>{
			selector
				.Init()
				.SetVisible(false)
				.SetCaptionByTextCode(`Settings.${tag}`)
				.Select( this.GetInitialSelectionIndexes(tag) )
				.KeepsOn(PageMaps[tag].KeepsOn)
				.Attr({zIndex:0x0100})
				.SetOnSelected((idxButon,tagButton)=>{
					this.DispatchOnSelect(SelectorMaps[tag],tagButton,0)
				})
				.buttons
					.SetTags( ... _(SelectorMaps[tag]).map("Tag") )
					.forEach((b)=> b.SetLabelText(L.Text(`Settings.${tag}.Label.${b.tag}`)) );
		});

		return this;
	}

	DeploySelectors(page){
		const size	= cc.director.getWinSize();

		this.lockPanel.Init();
		_(this.selectors).forEach(s=>s.SetVisible(false));
		let i=0;
		_(PageMaps)
			.forEach((pm,key)=>{
				if(pm.Order!=page)	return this;

				const selector	= this.selectors[key];
				if(!selector)	return this;

				selector
					.SetVisible(true)
					.SetEnabled(pm.IsEnabled)
					.SetOpacity(pm.IsEnabled?255:128)
					.SetArea(	SelectorAreaMargin.left,
								size.height - (SelectorAreaMargin.top+i*64)	);

				//ロックパネル
				if(!pm.IsEnabled){
					this.lockPanel.Spawn(	SelectorAreaMargin.left + 64*6/2,
											size.height - (SelectorAreaMargin.top+i*64)	-64/2 -1);
				}

				++i;
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

	/*選択肢の初期値*/
	GetInitialSelectionIndexes(tag){
		const currentSettings	= {
			Locale:		()=> L.GetCurrentPresetKey(),
			SfxVolume:	()=> Store.Select(Store.Handles.Settings.SfxVolume,"3"),
			BgmVolume:	()=> Store.Select(Store.Handles.Settings.BgmVolume,"3"),
			Navigator:	()=> Store.Select(Store.Handles.Settings.Navigator,"0"),
			Meteorite:	()=> Store.Select(Store.Handles.Settings.Meteorite,"0"),
			Storage:	()=> {},
		};
		const initialIndexes	= {
			Locale:		()=> Number(_(SelectorMaps.Locale   ).findKey(m=> m.Tag==currentSettings.Locale())		||0),
			SfxVolume:	()=> Number(_(SelectorMaps.SfxVolume).findKey(m=> m.Tag==currentSettings.SfxVolume())	||0),
			BgmVolume:	()=> Number(_(SelectorMaps.BgmVolume).findKey(m=> m.Tag==currentSettings.BgmVolume())	||0),
			Navigator:	()=> Number(_(SelectorMaps.Navigator).findKey(m=> m.Tag==currentSettings.Navigator())	||0),
			Meteorite:	()=> Number(_(SelectorMaps.Meteorite).findKey(m=> m.Tag==currentSettings.Meteorite())	||0),
			Storage:	()=> null,
		};

		return initialIndexes[tag]();
	}

	/** ストレージデータの削除（確認ダイアログ付き）
	 * @param {string} tag					タグ
	 * @param {boolean} removesSettings		ゲーム設定を削除するか
	 * @param {boolean} removesRecords		プレイ記録を削除するか
	 * @param {boolean} removesAchievements	実績を削除するか
	 * @returns
	 */
	static RemoveStorageData(tag, removeSettings, removesRecords,removesAchievements){
		//確認ダイアログ
		if(!window.confirm(L.Text(`Settings.Storage.Confirm.${tag}`)))	return this;

		if(removeSettings)		Store.RemoveSettings();
		if(removesRecords)		Store.RemoveAll();
		if(removesAchievements)	Achievement.RemoveAll();
		return this;
	}

}//class

class LockPanel{
	constructor(layer,nPanels){

		this.panels	= _.range(nPanels).map(()=>{
			return {
				sprite:	Sprite.CreateInstance(rc.img.lockPanel).AddToLayer(layer).SetVisible(false).Attr({zIndex:0x0105}),
				exists:	false,
			}
		});
	}

	Init(){
		this.panels.forEach(p=>{
			p.sprite.SetVisible(false);
			p.exists	= false;
		});
		return this;
	}

	Spawn(x,y){
		const panel	= this.panels.find(p=>!p.exists);
		if(!panel)	return this;

		panel.sprite.SetPosition(x,y).SetVisible(true);
		panel.exists	= true;
		return this;
	}
}

})();	//File Scope

