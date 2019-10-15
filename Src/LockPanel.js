/* *******************************************************************************
	設定画面のロックパネル
********************************************************************************/
var _;
var rc,L;
var Sprite,Label,Store,Achievement,Achievements;


/** セレクタのロックパネル */
// eslint-disable-next-line no-unused-vars
var LockPanel = class LockPanel{

	constructor(layer,nPanels){

		this.panels	= _.range(nPanels).map(()=>{
			return {
				sprite:	Sprite.CreateInstance(rc.img.lockPanel).AddToLayer(layer).SetVisible(false).Attr({zIndex:0x0105}),
				labels:	[	Label.CreateInstance(15).AddToLayer(layer).SetVisible(false).SetFontColor("#FFFF00","#000000",1),
							Label.CreateInstance(11).AddToLayer(layer).SetVisible(false).SetFontColor("#DDDDDD","#000000",1),	],
				exists:	false,
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
			p.exists	= false;
		});
		return this;
	}

	/** 生成
	 * @param {number} x
	 * @param {number} y
	 * @param {string} [subtext=""]	サブテキスト（ロック解除方法）
	 * @returns
	 * @memberof LockPanel
	 */
	Spawn(x,y,subtext=""){
		const panel	= this.panels.find(p=>!p.exists);
		if(!panel)	return this;

		panel.sprite.SetPosition(x,y).SetVisible(true);
		panel.labels[0].SetPosition(x,y).SetString(L.Text("Settings.LockPanel.Locked")).SetVisible(true);
		panel.labels[1].SetPosition(x,y-20).SetString(subtext).SetVisible(true);
		panel.exists	= true;
		return this;
	}

	/** ロック解除判定の関数群
	 * @readonly
	 * @static
	 * @memberof LockPanel
	 */
	static get Enablers(){
		return {
			Meteorite:	()=> Achievement.IsUnlocked(Achievements.Action.TouchPlayer),
			Navigator:	()=> Store.Select(Store.Handles.Action.NumNavigates[0],0) >=5,
		}
	}
}
