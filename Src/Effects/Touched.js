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
	Spawn(x,y,spawns=true){
		if(!spawns)	return this;
		super.Spawn();

		for(let i=0; i<_nParticles; ++i){
			for(let v of this.entities){
				if(v.exists)	continue;
				let angle	= this.GetRandamAngle(2/_nParticles,i*2/_nParticles);

				v.sprite
					.SetPosition(x,y).SetRotate(Math.random()*360).SetIndex(parseInt(Math.random()*8))
					.SetVisible(true).SetColor(this.color);
				v.dx		= this.initialVelocity.x * Math.cos(angle);
				v.dy		= this.initialVelocity.y * Math.sin(angle);
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

			v.dx	*= 0.9;
			v.dy	*= 0.9;

			v.sprite
				.SetPosition(v.sprite.x+v.dx,v.sprite.y+v.dy)
				.SetOpacity(255-v.count*8);
			++v.count;
			v.exists	= v.count < 32;
			v.sprite.SetVisible(v.exists);
		}
		return this;
	}

	/** ランダムな角度を出力する
	 * @param {number} [piradRange=2]			出力する範囲。単位はπrad。省略すると2（2πrad=360°）。
	 * @param {number} [piradStandardAngle=0]	出力範囲の中央となる値。単位はπrad。省略すると0。
	 * @returns {number} 						単位はrad
	 */
	GetRandamAngle(piradRange=2,piradStandardAngle=0){
		let pirad	= Math.random() * piradRange - piradRange/2 + piradStandardAngle;
		return Cycle(pirad,0,2) * Math.PI;
	}

}

})();	//File Scope
