/* *******************************************************************************
	プレイヤー飛行エフェクトクラス
********************************************************************************/
var Effects	= Effects || {};
var cc;
(function(){	//File Scope


/** @class プレイヤー飛行エフェクトクラス */
Effects.Fly	= class extends Effects.EffectBase{

	constructor(nEntities=5){
		super(nEntities);
	}

	Init(layer){
		this.InitParticles((particle)=>{
			particle	= Object.assign(particle,{
				sprite	: Sprite.CreateInstance(rc.img.flyFx).AddToLayer(layer)
								.SetPosition(100,100).Attr({zIndex:3,opacity:255}).SetBlend(cc.BlendFunc.ADDITIVE).SetVisible(false),
				scale	: 1.0,
			});
		});
		this.SetColor("#FFFFFF");
		return this;
	}

	/** プレイヤー飛行エフェクトをスポーン
	 * @returns {this}
	 */
	Spawn(x,y,spawns=true){
		if(!spawns)	return this;

		this.ActivateParticles(1,(v,i)=>{
			v.dx		= this.initialVelocity.x;
			v.dy		= NormalRandom(2)   + this.initialVelocity.y
			v.scale		= NormalRandom(0.5) + 1;

			v.sprite
				.SetPosition(x+NormalRandom(16), y+NormalRandom(4) )
				.SetRotate(Math.random()*360).SetScale(1+Math.random()).SetVisible(true)
				.SetColor(this.color);
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
			v.sprite
				.SetRelativePosition(v.dx,v.dy)
				.SetScale(v.scale)
				.SetOpacity(255-v.count*8);
			v.dx	+= this.acceleration.x;
			v.dy	+= this.acceleration.y;
			v.scale	+= 0.02;
		},32);
		return this;
	}
}

})();	//File Scope
