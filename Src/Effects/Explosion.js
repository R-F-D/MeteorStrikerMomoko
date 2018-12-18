/* *******************************************************************************
	爆発エフェクトクラス
********************************************************************************/
var Effects	= Effects || {};
var cc;
(function(){	//File Scope


/** @class 爆発エフェクトクラス */
Effects.Explosion	= class extends Effects.EffectBase{

	constructor(nEntities=5){
		super(nEntities*2);
	}

	Init(layer){
		super.Init();
		for(let entity of this.entities){
			entity	= Object.assign(entity,{
				sprite	: Sprite.CreateInstance(rc.img.flare).AddToLayer(layer)
							.SetScale(2).Attr({zIndex:0,opacity:255}).SetBlend(cc.BlendFunc.ADDITIVE).SetVisible(false),
				scale:	1.0,
			});
		}
		this.SetColor();
		return this;
	}

	/** エフェクトをスポーン
	 * @returns {this}
	 */
	Spawn(x,y,spawns=true){
		if(!spawns)	return this;
		super.Spawn();

		for(let i=0; i<2; ++i){
			for(let v of this.entities){
				if(v.exists)	continue;

				v.sprite.SetPosition(x,y).SetRotate(Math.random()*360).SetVisible(true).SetColor(this.color);
				v.dx		= this.initialVelocity.x;
				v.dy		= this.initialVelocity.y;
				v.exists	= true;
				v.count		= 0;
				break;
			};
		}
		return this;
	}

	Update(updates=true){
		if(!updates)	return this;
		super.Update();

		for(let v of this.entities){
			if(!v.exists)	continue;

			v.dx	+= this.acceleration.x;
			v.dy	+= this.acceleration.y;

			v.sprite
				.SetPosition(v.sprite.x+v.dx,v.sprite.y+v.dy)
				.SetOpacity(255-v.count*4)
				.SetScale(1.0+0.4*v.count);
			++v.count;
			v.exists	= v.count < 64;
			v.sprite.SetVisible(v.exists);
		}
		return this;
	}

	SetColor(color="#FF7F00",delays=true){
		return super.SetColor(color,delays);
	}

}

})();	//File Scope
