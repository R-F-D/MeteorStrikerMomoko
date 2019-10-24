/* *******************************************************************************
	設定画面のロックパネル
********************************************************************************/
var cc,_;
var rc,L;
var Store,Label,Button,Achievement,Achievements;
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
			LockPanel.ExtendPanelItemObject(panel);

			panel.selector		= selectors[panel.tag];
			panel.idxStorage	= null;

			panel
				.AddToLayer(panel.layer)
				.CreateSprite(rc.img.lockPanel)
				.CreateLabel(15)
				.SetVisible(false);

			panel.description	= Label.CreateInstance(11)
				.AddToLayer(panel.label.entity)
				.SetVisible(false);

				panel.SetLocked(true);
		});
	}

	/** リセット
	 * @returns
	 * @memberof LockPanel
	 */
	Reset(){
		this.forEach(panel=>{
			panel.SetVisible(false).SetLocked(true);
			panel.description.SetVisible(false);
			panel.idxStorage	= null;
		});
		return this;
	}

	//ロックパネルアイテムの関数拡張
	static ExtendPanelItemObject(panel){
		panel.Spawn	= function(){
			const texts	= [	panel.isLocked	?	L.Text("Settings.LockPanel.Locked")
												:	L.Text("Settings.LockPanel.Breakable"),
							panel.isLocked	?	L.Textf("Settings.LockPanel.Cond",  [L.Text(`Settings.${panel.tag}.Locked`)])
												:	L.Textf("Settings.LockPanel.Filled",[L.Text(`Settings.${panel.tag}.Locked`)])	];

			panel.SetVisible(true).SetLabelText(texts[0]);
			panel.description.SetVisible(true).SetString(texts[1]);

			panel
				.SetPosition(	panel.selector.area.x +PanelAdjust.x,
								panel.selector.area.y +PanelAdjust.y	);

			const cSize = panel.label.entity.getContentSize();
			panel.description.SetPosition(cSize.width/2,-cSize.height/2);

			return this;
		}

		panel.SetLocked	= function(isLocked){
			this.isLocked	= isLocked;
			if(this.isLocked){
				this
					.SetIndex(0)
					.SetLabelColor("#FFFF00","#000000",1);
//					.OnTouchBegan(()=>this.description.SetVisible(false))
//					.OnButtonUp(()=>this.description.SetVisible(true));
				this.description.SetFontColor("#CCCCCC","#000000",1);
			}
			else{
				this
					.SetIndex(1)
					.SetLabelColor("800000","#FFE0C0",1)
					.SetColorOnHover([0xFF,0xA0,0x00]);
				this.label.entity.RunActions( [null,cc.fadeTo(0.5,64),cc.fadeTo(0,255)] );
				this.description.SetFontColor("#444444","#FFE0C0",1);
			}
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
