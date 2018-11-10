/* *******************************************************************************
	GamePlayシーン
********************************************************************************/
var Scenes	= Scenes || {};
var cc;
(function(){	//File Scope

/** エイミングクラス */
Scenes.Aiming	= class {

	constructor(){
		/**ゲージ長*/		this.LENGTH				= 65536;	//this.MAX - this.MIN +1;	//正部＋負部＋０
		/**下限値*/			this.MIN				= -this.LENGTH/2;
		/**上限値*/			this.MAX				= +this.LENGTH/2;
		/**初期値*/			this.INITIAL			= 0;
		/**クリティカル幅*/	this.CRITICAL_LENGTH	= 1024*3;	//絶対値
		/**デフォルト増分*/	this.DEFAULT_INCREMENT	= 1024;
		/**増分サイ*/		this.INCREMENT_RANDAM	= 1024;
		/**基本倍率*/		this.BASE_RATE			= 256*256*128*128*2;
		/**ゲージ半径*/		this.RADIUS				= 64;

		/** @var エイミングのズレ */
		this.position	= 0;

		/** @var boolean ゲージ移動方向が正方向か */
		this.isIncrementPositive	= true;

		/** @var 増分 */
		this.increment	= 0;

		/** @var スプライト位置 */
		this.spritePos	= {x:0,y:0,}

		/** @var レイヤ */
		this.layer		= null;

		/** @var スプライト */
		this.sprites	= {
			/**ゲージ*/		gauge	: null,
			/**カーソル*/	cursor	: null,
		};
	}


	/** 初期化
	 * @returns this
	 * @memberof Aiming
	 */
	Init(){
		this.position				= this.INITIAL + Math.random()*this.LENGTH - this.LENGTH/2;
		this.isIncrementPositive	= Math.random() < 0.5;
		this.increment				= this.DEFAULT_INCREMENT + (Math.random()+Math.random())*this.INCREMENT_RANDAM/2;

		this.sprites.gauge			= Sprite.CreateInstance(res.img.aimGauge);
		this.sprites.cursor			= Sprite.CreateInstance(res.img.aimCursor);
		return this;
	}

	/** レイヤ設定
	 * @param {*} layer
	 * @returns this
	 * @memberof Aiming
	 */
	SetLayer(layer){
		this.sprites.gauge.AddToLayer(layer).Attr({x:this.spritePos.x, y:this.spritePos.y,});
		this.sprites.cursor.AddToLayer(layer);
		this.UpdateCursorSpritePos();
		return this;
	}
	/** スプライト座標を設定
	 * @param {*} x
	 * @param {*} y
	 * @returns this
	 * @memberof Aiming
	 */
	SetSpritePosition(x,y){
		this.spritePos.x	= x;
		this.spritePos.y	= y;
		this.sprites.gauge.Attr({x:x,y:y});
		this.UpdateCursorSpritePos();
		return this;
	}

	/** 更新
	 * @returns this
	 * @memberof Aiming
	 */
	Update(){
		//エイミングターゲット移動
		this.position += this.isIncrementPositive	? +this.increment	: -this.increment;
		if     (this.position < this.MIN){
			this.position			= this.MIN;
			this.isIncrementPositive= !this.isIncrementPositive;
		}
		else if(this.position > this.MAX){
			this.position			= this.MAX;
			this.isIncrementPositive= !this.isIncrementPositive;
		}
		//表示
		this.UpdateCursorSpritePos();

		return this;
	}
	/** @private */
	UpdateCursorSpritePos(){
		const angle	= this.position /this.MAX * Math.PI/4;
		this.sprites.cursor.Attr({
			x	: this.spritePos.x + Math.cos(angle) *this.RADIUS -this.RADIUS,
			y	: this.spritePos.y + Math.sin(angle) *this.RADIUS,
		});
		return this;
	}

	/** ジャスト位置からの距離
	 * @returns number
	 * @memberof Aiming
	 */
	GetGap(){ return Math.abs(this.position);	}
	/** エイミング倍率を取得
	 * @returns number
	 * @memberof Aiming
	 */
	GetRate(){
		return this.GetTotalRate() / this.BASE_RATE;
	}
	/** エイミング倍率✕基本倍率の値を取得
	 * @returns
	 * @memberof Aiming
	 */
	GetTotalRate(){
		let gap			= this.GetGap();
		let critical	= gap <= this.CRITICAL_LENGTH	? this.increment/this.DEFAULT_INCREMENT	: 1.0;
		return (this.LENGTH - gap) * (this.LENGTH - gap) * critical;
	}

	/** コンストラクタのラッパ
	 * @static
	 * @memberof Aiming
	 */
	static Create(){return new this;}
}


})();	//File Scope