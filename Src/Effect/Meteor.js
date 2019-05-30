/* *******************************************************************************
	隕石エフェクトクラス
********************************************************************************/
var Effect	= Effect || {};
var cc;
(function(){	//File Scope


/** @class 隕石エフェクトクラス */
Effect.Meteor	= class extends Effect.EffectBase{

	constructor(nEntities=5){
		super(nEntities);
	}

	Init(layer){
		this.InitParticles((particle)=>{
			particle	= Object.assign(particle,{
				sprite	: Sprite.CreateInstance(rc.img.flare).AddToLayer(layer)
							.SetScale(2).Attr({zIndex:0,opacity:255}).SetVisible(false),
			});
		});
		this.SetColor();
		return this;
	}

	/** 隕石エフェクトをスポーン
	 * @returns {this}
	 */
	Spawn(x,y,spawns=true){
		if(!spawns)	return this;

		this.ActivateParticles(1,(v,i)=>{
			v.sprite.SetPosition(x,y).SetRotate(Math.random()*360).SetVisible(true).SetColor(this.color);
			v.dx		= this.initialVelocity.x;
			v.dy		= NormalRandom(2)+this.initialVelocity.y;
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

		this.UpdateParticles(v=>{
			v.sprite
				.SetPosition(v.sprite.x+v.dx,v.sprite.y+v.dy)
				.SetOpacity(255-v.count*4)
				.SetScale(1.5+0.1*v.count);
			v.dx	+= this.acceleration.x;
			v.dy	+= this.acceleration.y;
		},60);
		return this;
	}

	SetColor(color="#FF0000",delays=true){
		return super.SetColor(color,delays);
	}
}

})();	//File Scope
