/* *******************************************************************************
	隕石エフェクトクラス
********************************************************************************/
var Scenes	= Scenes || {};
var cc;
(function(){	//File Scope

//	Bad	Normal	Good Critical

/** @class 隕石エフェクトクラス */
Scenes.MeteorEffect	= class{

	constructor(nEntities=5){
		this.nEntities	= nEntities;
		this.entities	= []
	}
	static Create(nEntities){return new Scenes.MeteorEffect(nEntities);}

	Init(layer){
		for(let i=0; i<this.nEntities; ++i){
			this.entities[i]	= {
				sprite	: Sprite.CreateInstance(rc.img.flare).AddToLayer(layer)
								.SetScale(2).SetPosition(250,120).Attr({zIndex:0,opacity:255}).SetColor("#FF0000").SetVisible(false),
				exist	: false,
				count	: 0,
			}
		}
		return this;
	}

	/** 隕石エフェクトをスポーン
	 * @returns {this}
	 */
	Spawn(){
		for(let v of this.entities){
			if(v.exists)	continue;

			v.sprite.SetRotate(Math.random()*360).SetVisible(true);
			v.exists	= true;
			v.count		= 0;
			break;
		};
		return this;
	}

	Update(){
		for(let v of this.entities){
			if(!v.exists)	continue;

			v.sprite.SetPosition(250+v.count*8,120+v.count).SetOpacity(255-v.count*4).SetScale(1.5+0.1*v.count);
			++v.count;
			v.exists	= v.count < 60;
			v.sprite.SetVisible(v.exists);
		}
		return this;
	}
}

})();	//File Scope
