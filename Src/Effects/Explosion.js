/* *******************************************************************************
	爆発エフェクトクラス
********************************************************************************/
var Effects	= Effects || {};
var cc;
(function(){	//File Scope


const FxType	= {
	Particle:0,	Letters:1,
};

/** @class 爆発エフェクトクラス */
Effects.Explosion	= class extends Effects.EffectBase{

	constructor(nEntities=5){
		super(nEntities*2);
	}

	Init(layer){
		this.InitParticles((particle,i)=>{
			if(i%2==0){
				particle	= Object.assign(particle,{
					sprite:	Sprite.CreateInstance(rc.img.flare).AddToLayer(layer)
								.SetScale(2).Attr({zIndex:0,opacity:255}).SetBlend(cc.BlendFunc.ADDITIVE).SetVisible(false),
					scale:	1,
					type:	FxType.Particle,
				});
			}
			else{
				particle	= Object.assign(particle,{
					sprite:	Sprite.CreateInstance(rc.img.explosion).AddToLayer(layer)
								.SetScale(1).Attr({zIndex:1,opacity:255}).SetVisible(false),
					scale:	1,
					type:	FxType.Letters,
				});

			}
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
			if((v.type==FxType.Particle)){
				v.sprite.SetPosition(x,y).SetRotate(Math.random()*360).SetVisible(true).SetColor(this.color);
			}
			else{
				v.sprite.SetPosition(x,y).SetScale(0.25).SetVisible(true).RunAction(
					new cc.Sequence(
						cc.ScaleTo.create(1.0,0.5).easing(cc.easeBackOut(100)),
						cc.FadeTo.create(1.0,0)
					)
				);
			}
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

			if(v.type==FxType.Particle){
				v.sprite
					.SetRelativePosition(v.dx,v.dy)
					.SetOpacity(255-v.count*4)
					.SetScale(1.0+0.4*v.count);
				if(v.count>64)	v.exists = false;
			}
			else{
				if(!v.sprite.IsRunningActions())	v.exists = false;
			}
		},null);
		return this;
	}

	SetColor(color="#FF7F00",delays=true){
		return super.SetColor(color,delays);
	}
}

})();	//File Scope
