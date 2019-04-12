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
		this.InitParticles((particle)=>{
			particle	= Object.assign(particle,{
				sprite	: Sprite.CreateInstance(rc.img.flare).AddToLayer(layer)
							.SetScale(2).Attr({zIndex:0,opacity:255}).SetBlend(cc.BlendFunc.ADDITIVE).SetVisible(false),
				scale:	1.0,
			});
		});
		this.SetColor();
		return this;
	}

	/** エフェクトをスポーン
	 * @returns {this}
	 */
	Spawn(x,y,spawns=true){
		if(!spawns)	return this;

		this.ActivateParticles(2,(v,i)=>{
			v.sprite.SetPosition(x,y).SetRotate(Math.random()*360).SetVisible(true).SetColor(this.color);
			v.dx		= this.initialVelocity.x;
			v.dy		= this.initialVelocity.y;
			return true;
		});
		return this;
	}

	/** 更新
	 * @param {boolean} [updates=true] 真値のときのみ実行
	 * @returns this
	 */
	Update(updates=true){
		if(!updates)	return this;

		this.UpdateParticles((v)=>{
			v.dx	+= this.acceleration.x;
			v.dy	+= this.acceleration.y;

			v.sprite
				.SetPosition(v.sprite.x+v.dx,v.sprite.y+v.dy)
				.SetOpacity(255-v.count*4)
				.SetScale(1.0+0.4*v.count);
		},64);
		return this;
	}

	SetColor(color="#FF7F00",delays=true){
		return super.SetColor(color,delays);
	}
}

})();	//File Scope
