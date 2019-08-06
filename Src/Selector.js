/* *******************************************************************************
	選択肢クラス
********************************************************************************/
var cc;

class Selector{

	constructor(nItems){
		this.buttons	= Button.CreateInstance(nItems);
		this.layer		= null;

		this.x		= 0;
		this.y		= 0;
		this.gap	= 16;
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

	SetPositionTL(leftX,topY){
		this.buttons.forEach((button,i)=>{
			const size		= button.sprite.entity.getBoundingBox();
			const anchor	= button.sprite.entity.getAnchorPoint();

			this.x		= leftX + size.width * anchor.x;
			this.y		= topY  - size.height* anchor.y;
			button.SetPosition(this.x+i*(size.width+this.gap),this.y);
		});
		return this;
	}


	Update(dt){
		this.buttons.Update(dt);
		return this;
	}


}


