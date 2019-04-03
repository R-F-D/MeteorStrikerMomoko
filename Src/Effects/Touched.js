/* *******************************************************************************
	タッチエフェクトクラス
********************************************************************************/
var Effects	= Effects || {};
var cc;
(function(){	//File Scope


const _nParticles	= 5;

/** @class タッチエフェクトクラス */
Effects.Touched	= class extends Effects.EffectBase{

	constructor(nEntities=5){
		super(_nParticles*nEntities);
	}

	Init(layer){
		super.Init();
		for(let entity of this.entities){
			entity	= Object.assign(entity,{
				sprite	: Sprite.CreateInstance(rc.img.touched).AddToLayer(layer)
							.SetScale(0.5).Attr({zIndex:65535,opacity:255}).SetVisible(false),
				index	: 0,
	
			});
		}
		this.SetVelocity(4,4).SetColor();
		return this;
	}

	/** エフェクトをスポーン
	 * @returns {this}
	 */
	Spawn(x,y){
		this.ActivateParticles(_nParticles,(v,i)=>{
			let angle	= GetRandamAngle(2/_nParticles,i*2/_nParticles);

			v.sprite
				.SetPosition(x,y).SetRotate(Math.random()*360).SetIndex(parseInt(Math.random()*8))
				.SetVisible(true).SetColor(this.color);
			v.dx		= this.initialVelocity.x * Math.cos(angle);
			v.dy		= this.initialVelocity.y * Math.sin(angle);
			return true;
		})
		return this;
	}

	/** 更新
	 * @param {boolean} [updates=true] 真値のときのみ実行
	 * @returns this
	 */
	Update(updates=true){
		if(!updates)	return this;
		
		this.UpdateParticles((v)=>{
			v.dx	*= 0.9;
			v.dy	*= 0.9;

			v.sprite
				.SetPosition(v.sprite.x+v.dx,v.sprite.y+v.dy)
				.SetOpacity(255-v.count*8);
		},32);
		return this;
	}
}

})();	//File Scope
