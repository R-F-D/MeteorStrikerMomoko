/* *******************************************************************************
	パーティクルエフェクト基本クラス
********************************************************************************/
var Effect	= Effect || {};
(function(){	//File Scope

Effect.EffectBase	= class{

	constructor(nEntities=5){
		this.nEntities			= nEntities;
		this.entities			= [];
		this.initialVelocity	= { x:0, y:0, };
		this.acceleration		= { x:0, y:0, };
		this.color				= "#FFFFFF";
	}
	static Create(nEntities){return new this(nEntities);}

	/** entities配列の初期化
	 * @returns {this}
	 */
	Init(){return this.InitParticles();}

	/** 全パーティクルの初期化
	 * @param {function(particle,index)} [initializer=null] 初期化関数 f(particle,index)
	 * @returns
	 */
	InitParticles(initializer=null){
		for(let i=0; i<this.nEntities; ++i){
			this.entities[i]	= {
				sprite	: null,
				sprites	: [],
				exist	: false,
				count	: 0,
				dx		: 0,
				dy		: 0,
			};
			if(initializer)	initializer(this.entities[i],i);
		}
		return this;
}

	/** パーティクルの速度設定
	 * @param {number} initDx x初速度
	 * @param {number} initDy y初速度
	 * @param {number} [accelDx=0] x加速度
	 * @param {number} [accelDy=0] y加速度
	 * @returns {this}
	 */
	SetVelocity(initDx,initDy,accelDx=0,accelDy=0){
		this.initialVelocity.x	= initDx;
		this.initialVelocity.y	= initDy;
		this.acceleration.x		= accelDx;
		this.acceleration.y		= accelDy;
		return this;
	}

	/** パーティクルの色設定
	 * @param {string} color 文字コード
	 * @param {boolean} delays 現在表示されているパーティクルは変化させない
	 * @returns {this}
	 */
	SetColor(color="#FFFFFF",delays=true){
		this.color	= color;
		if(!delays){
			for(let entity of this.entities){
				if(entity.sprite)	entity.sprite.SetColor(this.color);
				for(let s of entity.sprites)	if(s) s.SetColor(this.color);
			}
		}
		return this;
	}

	/** パーティクル生成
	 * @returns {this}
	 */
	Spawn(){ return this.ActivateParticles(1,(v,i)=>false) }

	/** パーティクルをアクティブにする
	 * @param {number} nParticles 一度にアクティブ化するパーティクル数。1以上。
	 * @param {function(particle,i)} activator アクティブ化させる関数。f(p,i):boolean p:パーティクルオブジェクト、i:インデックス。真を返すこと。
	 * @returns this
	 */
	ActivateParticles(nParticles,activator){
		if(typeof(activator)!=="function") throw new Error("Argument2 is not function.");

		for(let i=0; i<nParticles; ++i){
			for(let v of this.entities){
				if(v.exists)	continue;
				if(activator(v,i)){
					//アクティブ化に成功
					v.exists	= true;
					v.count		= 0;
					break;
				}
				continue;
			}
		}
		return this;
	}

	/** パーティクル更新
	 * @returns {this}
	 */
	Update(){ return this.UpdateParticles(()=>{}) }

	/** パーティクル更新
	 * @param {function(particle)} updater パーティクルを更新する述語関数。f(p)、pはパーティクルオブジェクト。
	 * @param {number|null} [lifetime=null] パーティクルの寿命。nulで無限
	 * @returns
	 */
	UpdateParticles(updater,lifetime=null){
		if(typeof(updater)!=="function") throw new Error("Argument0 is not function.");

		for(let v of this.entities){
			if(!v.exists)	continue;

			//パーティクル更新
			updater(v);
			++v.count;
			if(!v.exists || (lifetime!==null && v.count >= lifetime))	this.DestroyParticle(v);
			continue;
		}
		return this;
	}

	/** パーティクル削除
	 * @param {*} particle パーティクルオブジェクト
	 * @returns this
	 */
	DestroyParticle(particle){
		particle.exists	= false;
		if(particle.sprite)	particle.sprite.SetVisible(false);
		for(let s of particle.sprites)	if(s) s.SetVisible(false);
		return this;
	}

	/** 全てのパーティクルを削除
	 * @returns this
	 */
	Destroy(){
		for(let v of this.entities)	this.DestroyParticle(v);
		return this;
	}

} //class


})();	//File Scope
