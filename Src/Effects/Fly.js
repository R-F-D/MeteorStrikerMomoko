/* *******************************************************************************
	プレイヤー飛行エフェクトクラス
********************************************************************************/
var Effects	= Effects || {};
var cc;
(function(){	//File Scope


/** @class プレイヤー飛行エフェクトクラス */
Effects.Fly	= class extends Effects.EffectBase{

	Init(layer){
		for(let i=0; i<this.nEntities; ++i){
			this.entities[i]	= {
				sprite	: Sprite.CreateInstance(rc.img.flyFx).AddToLayer(layer)
								.SetPosition(100,100).Attr({zIndex:3,opacity:255}).SetBlend(cc.BlendFunc.ADDITIVE).SetVisible(false),
				exist	: false,
				count	: 0,
				dy		: 0,
				dx		: 0,
				scale	: 1.0,
			}
		}
		return this;
	}

	/** プレイヤー飛行エフェクトをスポーン
	 * @returns {this}
	 */
	Spawn(x,y,spawns=true){
		if(!spawns)	return this;

		for(let v of this.entities){
			if(v.exists)	continue;

			v.dx		= -0.5;
			v.dy		= NormalRandom(2)   -1;
			v.scale		= NormalRandom(0.5) +1;
			v.exists	= true;
			v.count		= 0;

			v.sprite
				.SetPosition(x+NormalRandom(16), y+NormalRandom(4) )
				.SetRotate(Math.random()*360).SetScale(1+Math.random()).SetVisible(true);
			return this;
		};
		return this;
	}

	Update(updates=true){
		if(!updates)	return this;

		for(let v of this.entities){
			if(!v.exists)	continue;

			v.sprite
				.SetRelativePosition(v.dx,v.dy)
				.SetScale(v.scale)
				.SetOpacity(255-v.count*8);
			v.dx	+= 0.2;
			v.scale	+= 0.02;
			++v.count;
			v.exists= v.count < 32;
			v.sprite.SetVisible(v.exists);
		}
		return this;
	}
}

})();	//File Scope
