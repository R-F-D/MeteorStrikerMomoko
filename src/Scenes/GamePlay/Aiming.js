/* *******************************************************************************
	GamePlayシーン
********************************************************************************/
var Scenes	= Scenes || {};
var cc;
(function(){	//File Scope

/** エイミングクラス */
Scenes.Aiming	= class{

	constructor(){
		/**下限値*/		this.MIN		= -32767;
		/**ジャスト*/	this.JUST		= 0;
		/**上限値*/		this.MAX		= 32768;
		/**初期値*/		this.INITIAL	= this.MAX;
		/**増分*/		this.INCREMENT	= -1024;
		/**ゲージ長*/	this.LENGTH		= this.MAX - this.MIN +1;	//正部＋負部＋０
		/**基本倍率*/	this.BASE_RATE	= 256*256*128*128*2;

		/** @var エイミングのズレ */
		this.position	= 0;

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

	Init(){
		this.sprites.gauge		= Sprite.CreateInstance(res.img.aimGauge);
		this.sprites.cursor		= Sprite.CreateInstance(res.img.aimCursor);
		return this;
	}

	SetLayer(layer){
		this.sprites.gauge.AddToLayer(layer).Attr({x:this.spritePos.x, y:this.spritePos.y,});
		this.sprites.cursor.AddToLayer(layer).Attr({x:this.spritePos.x, y:this.spritePos.y+this.position/512,});
		return this;
	}
	SetSpritePosition(x,y){
		this.spritePos.x	= x;
		this.spritePos.y	= y;
		this.sprites.gauge.Attr({x:x,y:y});
		this.sprites.cursor.Attr( {x:x,y:y,});
		return this;
	}

	/** 更新
	 * @returns this
	 * @memberof Aiming
	 */
	Update(){
		this.position += this.INCREMENT;
		if     (this.position < this.MIN)	this.position = this.MAX;
		else if(this.position > this.MAX)	this.position = this.MIN;

		this.sprites.cursor.Attr({x:this.spritePos.x, y:this.spritePos.y+this.position/512,});
		return this;
	}


	/** ジャスト位置からの距離
	 * @returns number
	 * @memberof Aiming
	 */
	GetGap(){ return Math.abs(this.position);	}
	/** エイミング倍率を取得
	 * @returns number 0.5～2.0の値
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
		let gap	= this.GetGap();
		return (this.LENGTH - gap) * (this.LENGTH - gap);
	}

	/** コンストラクタのラッパ
	 * @static
	 * @memberof Aiming
	 */
	static Create(){return new this;}
}


})();	//File Scope