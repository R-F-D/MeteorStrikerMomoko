/* *******************************************************************************
	予備動作エフェクトクラス
********************************************************************************/
var Effect	= Effect || {};
var cc;
(function(){	//File Scope

const _nParticles   = 1;

/** @class 予備動作エフェクトクラス */
Effect.Preliminary	= class extends Effect.EffectBase{

	constructor(nEntities=1){
		super(nEntities*_nParticles);
	}

	Init(layer){
		this.InitParticles((particle)=>{
			particle	= Object.assign(particle,{
				sprite	: Sprite.CreateInstance(rc.img.preliminaryFx).AddToLayer(layer)
							.Attr({zIndex:120,opacity:255}).SetVisible(false),
			});
		});
		this.SetVelocity(4,4).SetColor();
		return this;
	}

	/** エフェクトをスポーン
	 * @returns {this}
	 */
	Spawn(x,y){
		this.ActivateParticles(_nParticles,(v,i)=>{
			v.sprite
				.SetPosition(x,y).SetVisible(true).SetScale(0.5).SetRotate(0).SetOpacity(192).SetColor(this.color);
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
			v.sprite.SetScale(0.5+v.count/120).SetRotate(-v.count/4).SetOpacity(192+v.count);
		},64);
		return this;
	}
}

})();	//File Scope
