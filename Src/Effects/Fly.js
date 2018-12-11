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
			}
		}
		return this;
	}

	/** プレイヤー飛行エフェクトをスポーン
	 * @returns {this}
	 */
	Spawn(spawns=true,x,y){
		if(!spawns)	return this;

		for(let v of this.entities){
			if(v.exists)	continue;

			v.sprite
				.SetPosition(x+(Math.random()+Math.random()*32)-16, y+(Math.random()+Math.random()*8)-4 )
				.SetRotate(Math.random()*360).SetScale(1+Math.random()).SetVisible(true);
			v.dx		= -0.5;
			v.dy		= (Math.random()+Math.random()*2)-2;
			v.exists	= true;
			v.count		= 0;
			break;
		};
		return this;
	}

	Update(updates=true){
		if(!updates)	return this;

		for(let v of this.entities){
			if(!v.exists)	continue;

			v.sprite
				.SetRelativePosition(v.dx,v.dy)
				.SetOpacity(255-v.count*4);
			++v.count;
			v.dx+=0.2;
			v.exists	= v.count < 30;
			v.sprite.SetVisible(v.exists);
		}
		return this;
	}
}

})();	//File Scope
