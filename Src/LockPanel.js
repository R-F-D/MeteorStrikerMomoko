/* *******************************************************************************
	設定画面のロックパネル
********************************************************************************/
var _;
var rc,L;
var Sprite,Label,Store,Achievement,Achievements;
var LockPanel	= LockPanel||{};
(function(){	//File Scope

const PanelAdjust	= {x:64*6/2, y:-1};


/** セレクタのロックパネル */
LockPanel = class LockPanel{

	constructor(layer,nPanels){

		this.panels	= _.range(nPanels).map(()=>{
			return {
				selector:		null,
				sprite:			Sprite.CreateInstance(rc.img.lockPanel).AddToLayer(layer).SetVisible(false).Attr({zIndex:0x0105}),
				labels:			[	Label.CreateInstance(15).AddToLayer(layer).SetVisible(false).SetFontColor("#FFFF00","#000000",1),
									Label.CreateInstance(11).AddToLayer(layer).SetVisible(false).SetFontColor("#DDDDDD","#000000",1),	],
				exists:			false,
				isLockPanel:	true,
				idxStorage:		null,
			}
		});
	}

	/** リセット
	 * @returns
	 * @memberof LockPanel
	 */
	Reset(){
		this.panels.forEach(p=>{
			p.sprite.SetVisible(false);
			p.labels.forEach(l=>l.SetVisible(false));
			p.exists		= false;
			p.isLockPanel	= true;
			p.idxStorage	= null;
		});
		return this;
	}

	/** 生成
	 * @param {Selector} selector	紐付けるセレクタ
	 * @param {string} subtext		サブテキスト（ロック解除方法）
	 * @returns
	 * @memberof LockPanel
	 */
	Spawn(selector,subtext){
		if(!selector)	return this;
		this.selector	= selector;

		const panel	= this._Spawn(	this.selector.area.x +PanelAdjust.x,	this.selector.area.y +PanelAdjust.y,	0,
									L.Text("Settings.LockPanel.Locked"),	subtext);
		if(!panel)	return this;
		return this;
	}

	_Spawn(x,y,idxSprite,text1,text2){
		const panel	= this.panels.find(p=>!p.exists);
		if(!panel)	return null;

		panel.sprite.SetPosition(x,y).SetVisible(true).SetIndex(idxSprite);
		panel.labels[0].SetPosition(x,y).SetString(text1).SetVisible(true);
		panel.labels[1].SetPosition(x,y-20).SetString(text2).SetVisible(true);
		panel.exists	= true;
		return panel;
	}

	/** ロック解除判定の関数群
	 * @readonly
	 * @static
	 * @memberof LockPanel
	 */
	static get Enablers(){
		return {
			Meteorite:	()=> Achievement.IsUnlocked(Achievements.Action.TouchPlayer),
			Navigator:	()=> Store.Select(Store.Handles.Action.NumPlays,0) >=5,
		}
	}
}

})();	//File Scope
