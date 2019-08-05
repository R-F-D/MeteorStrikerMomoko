/* *******************************************************************************
	選択肢クラス
********************************************************************************/
var cc;

class Selector{

	constructor(nItems){
		this.buttons	= Button.CreateInstance(nItems);
		this.layer		= null;
	}

	Init(){
		this.buttons.forEach(button=>{
			button
				.CreateSprite(rc.img.labelButton)
				.CreateLabel(20)
				.SetColorOnHover([0xFF,0xA0,0x00])
				.SetLabelColor("#FF0000")
				.SetScale(0.5);
		});
		return this;
	}

	AddToLayer(layer){
		this.layer	= layer;
		this.buttons.AddToLayer(layer);
		return this;
	}

	Update(dt){
		this.buttons.Update(dt);
		return this;
	}
}


