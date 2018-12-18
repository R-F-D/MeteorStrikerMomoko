/* *******************************************************************************
	パーティクルエフェクト基本クラス
********************************************************************************/
var Effects	= Effects || {};
var cc;
(function(){	//File Scope

Effects.EffectBase	= class{

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
	Init(){
		for(let i=0; i<this.nEntities; ++i){
			this.entities[i]	= {
				sprite	: null,
				exist	: false,
				count	: 0,
				dx		: 0,
				dy		: 0,
			}
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
	 * @param {boolean} delays 遅延
	 * @returns {this}
	 */
	SetColor(color="#FFFFFF",delays=true){
		this.color	= color;
		if(!delays){
			for(let entity of this.entities){
				entity.sprite.SetColor(this.color);
			}
		}
		return this;
	}

	/** パーティクル生成
	 * @returns {this}
	 */
	Spawn(){return this;}

	/** パーティクル更新
	 * @returns {this}
	 */
	Update(){return this;}

} //class


})();	//File Scope
