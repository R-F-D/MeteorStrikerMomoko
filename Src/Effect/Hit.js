/* *******************************************************************************
	ヒットエフェクトクラス
********************************************************************************/
var Effect	= Effect || {};
var cc;
var rc;
(function(){	//File Scope

const _nParticles   = 1;

/** @class ヒットエフェクトクラス */
Effect.Hit	= class extends Effect.EffectBase{

	constructor(nEntities=1){
		super(nEntities*_nParticles);
	}

	Init(layer){
		this.InitParticles((particle)=>{
			particle	= Object.assign(particle,{
				sprite	: Sprite.CreateInstance(rc.img.hitFx).AddToLayer(layer)
							.SetScale(1).Attr({zIndex:120,opacity:255}).SetBlend(cc.BlendFunc.ADDITIVE).SetVisible(false),
				index	: 0,

			});
		});
		this.SetVelocity(4,4).SetColor();
		return this;
	}

	/** エフェクトをスポーン
	 * @returns {this}
	 */
	Spawn(x,y,scale){
		this.ActivateParticles(_nParticles,(v,i)=>{
			v.sprite
				.SetPosition(x,y).SetRotate(Math.random()*360).SetIndex(0)
				.SetVisible(true).SetScale(scale).SetColor(this.color);
				v.index=0;
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
			v.sprite.SetIndex(v.index);
			if(v.count%2==0)    v.index++;
		},8*2);
		return this;
	}
}

})();	//File Scope
