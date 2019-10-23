/* *******************************************************************************
	設定画面のロックパネル
********************************************************************************/
var _;
var rc,L;
var Sprite,Label,Store,Selector,Achievement,Achievements;
var LockPanel	= LockPanel||{};
(function(){	//File Scope

const PanelAdjust	= {x:64*6/2, y:-1};


/** セレクタのロックパネル */
LockPanel = class LockPanel extends Button{

	constructor(selectors){
		super(Object.keys(selectors).length);

		this.SetTags(Object.keys(selectors));
		this.AddToLayer( _(selectors).find(s=>!!s.layer).layer );

		this.forEach(panel=>{
			panel.selector	= selectors[panel.tag];
			panel.isLockPanel	= true;
			panel.idxStorage	= null;

			panel
				.AddToLayer(panel.selector.layer)
				.CreateSprite(rc.img.lockPanel)
				.CreateLabel(15).SetVisible(false);

			LockPanel.ExtendPanelItemObject(panel);
		});
	}

	/** リセット
	 * @returns
	 * @memberof LockPanel
	 */
	Reset(){
		this.forEach(panel=>{
			panel.SetVisible(false);
			panel.isLockPanel	= true;
			panel.idxStorage	= null;
		});
		return this;
	}


	Apply(){
		this.forEach(panel=>{
			panel
				.SetPosition(	panel.selector.area.x +PanelAdjust.x,
								panel.selector.area.y +PanelAdjust.y	);
		});
		return this;
	}

	//ロックパネルアイテムの関数拡張
	static ExtendPanelItemObject(panel){
		panel.Spawn	= function(){
			panel.SetVisible(true);
			return this;
		}
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
