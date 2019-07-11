/* *******************************************************************************
	GamePlayシーン
********************************************************************************/
var Scene	= Scene || {};
var cc;
(function(){	//File Scope

/** エイミングクラス */
Scene.Aiming	= class {

	constructor(){
		/**ゲージ長*/this.LENGTH				= 65536;
		/**下限値*/			this.MIN				= -this.LENGTH/2;
		/**上限値*/			this.MAX				= +this.LENGTH/2;
		/**初期値*/			this.INITIAL			= 0;
		/**デフォルト増分*/	this.DEFAULT_INCREMENT	= 1024;
		/**増分サイ*/		this.INCREMENT_RANDAM	= this.DEFAULT_INCREMENT/2;
		/**ゲージ半径*/		this.RADIUS				= 64;
		/**ヒット領域タグ*/	this.AREAS				= {	PERFECT:	{tag:"PERFECT",	rate:1.20,	addRate:0.5,idxSprite:3,	imgIndex:0,	},
														GOOD:		{tag:"GOOD",	rate:1.20,	addRate:0,	idxSprite:2,	imgIndex:1,	},
														NORMAL: 	{tag:"NORMAL",	rate:1.05,	addRate:0,	idxSprite:1,	imgIndex:2,	},
														BAD: 		{tag:"BAD",		rate:1.00,	addRate:0,	idxSprite:0,	imgIndex:3,	}};

		/** @var エイミング位置 */
		this.position	= 0;

		/** @var boolean ゲージ移動方向が正方向か */
		this.isIncrementPositive	= true;

		/** @var ヒット領域 */
		this.hitAreas	= [];

		/** @var 現在のヒット領域 */
		this.currentArea	= null;

		/** @var 増分 */
		this.increment	= 0;

		/** @var スプライト位置 */
		this.spritePos	= {x:0,y:0,}

		/** @var スプライトの可視 */
		this.isVisible	= true;
		/** @var スプライト不透明度 */
		this.opacity	= 255;

		/** @var レイヤ */
		this.layer		= null;

		/** @var スプライト */
		this.sprites	= {
			/**ゲージ*/		bar		: null,
			/**カーソル*/	cursor	: null,
			/**倍率表示*/	rates	: [],
		};

	}


	/** 初期化
	 * @returns this
	 * @memberof Aiming
	 */
	Init(){
		this.PushHitArea( "PERFECT",	-0.10,	0.10 )
			.PushHitArea( "GOOD",		-0.25,	0.25 )
			.PushHitArea( "NORMAL",		-0.75,	0.75 );

		this.position				= this.INITIAL + Math.random()*this.LENGTH - this.LENGTH/2;
		this.isIncrementPositive	= Math.random() < 0.5;
		this.increment				= this.DEFAULT_INCREMENT + NormalRandom(this.INCREMENT_RANDAM) + this.INCREMENT_RANDAM;
		this.currentArea			= null;

		this.sprites.bar			= Sprite.CreateInstance(rc.img.aimBar).Attr({zIndex:100});;
		this.sprites.cursor			= Sprite.CreateInstance(rc.img.aimCursor).Attr({zIndex:100});;
		for(let i=0;i<6;++i){
			this.sprites.rates.push(Sprite.CreateInstance(rc.img.aimValue).Attr({zIndex:111}).SetVisible(false));
		}

		return this;
	}

	/** レイヤ設定
	 * @param {*} layer
	 * @returns this
	 * @memberof Aiming
	 */
	SetLayer(layer){
		this.sprites.bar.AddToLayer(layer).Attr({x:this.spritePos.x, y:this.spritePos.y,});
		this.sprites.cursor.AddToLayer(layer);
		this.sprites.rates.forEach(s=>s.AddToLayer(layer));
		this.UpdateCurrentArea().UpdateCursorSpritePos();
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
		this.sprites.bar.SetPosition(x-this.RADIUS,y,Math.PI/4,this.RADIUS);
		this.UpdateCurrentArea().UpdateCursorSpritePos();
		return this;
	}

	/** 更新
	 * @returns this
	 * @memberof Aiming
	 */
	Update(movesCursor=true){
		//エイミングターゲット移動
		if(movesCursor){
			this.currentArea			= null;
			this.position += this.isIncrementPositive	? +this.increment	: -this.increment;
			if     (this.position < this.MIN){
				this.position			= this.MIN;
				this.isIncrementPositive= !this.isIncrementPositive;
			}
			else if(this.position > this.MAX){
				this.position			= this.MAX;
				this.isIncrementPositive= !this.isIncrementPositive;
			}
			this.UpdateCurrentArea();
		}

		//表示
		if(this.isVisible)	this.opacity	= Math.min(this.opacity+4,255);
		else				this.opacity	= Math.max(this.opacity-4,0);
		this.sprites.bar.SetOpacity(this.opacity);
		this.UpdateCursorSpritePos();

		return this;
	}

	/** カーソル画像の位置を更新
	 * @returns this
	 * @private */
	UpdateCursorSpritePos(){
		this.UpdateCurrentArea(false);

		this.sprites.cursor
			.SetIndex(this.currentArea.idxSprite)
			.SetPosition( this.spritePos.x-this.RADIUS,	this.spritePos.y,	this.position /this.MAX * Math.PI/4 + Math.PI/4,	this.RADIUS	)
			.SetOpacity(this.opacity);

		return this;
	}

	/** ジャスト位置からの距離
	 * @returns number
	 * @memberof Aiming
	 */
	GetGap(){
		return Math.abs(this.position);
	}

	/** エイミング精度を取得
	 * @param {boolean} [isForDisplay=false] 表示用に補正する
	 * @returns {number} 倍率
	 * @memberof Aiming
	 */
	GetRate(isForDisplay=false){
		let rate	= (this.LENGTH - this.GetGap()) / this.LENGTH;
		if(isForDisplay){
			if     (rate < 0.505)	rate = 0.500;
			else if(rate > 0.995)	rate = 1.000;
			return (rate*100).toFixed(1);
		}
		return Clamp(rate, 0.500, 1.000);
	}
	/** エイミング倍率（精度・エリア倍率・クリティカル込み）を取得
	 * @returns
	 * @memberof Aiming
	 */
	GetTotalRate(){
		const area		= this.GetCurrentArea();
		const critical	= area.addRate * this.increment / this.DEFAULT_INCREMENT +1;	//クリティカル倍率
		return Math.max(0, this.GetRate() * area.rate * critical);
	}

	/** ヒット領域を追加
	 * @param {*} tagName
	 * @param {*} [min=1] 0.0-1.0
	 * @param {*} [max=1] 0.0-1.0
	 * @returns this
	 */
	PushHitArea(tagName,min=1,max=1){
		if(!Object.values(this.AREAS).map(v=>v.tag).includes(tagName))	return this;

		if(max<min)	min	= [max,max=min][0];	//swap
		this.hitAreas.push({
			"tag"	: tagName,
			"min"	: min * this.LENGTH/2,
			"max"	: max * this.LENGTH/2,
		});
		return this;
	}

	/** ヒット領域を取得
	 * @param {*} pos
	 * @returns
	 */
	GetArea(pos){
		for(let v of this.hitAreas){
			if(v.min<=pos && pos<=v.max)	return this.AREAS[v.tag];
		}
		return this.AREAS.BAD;
	}

	/** 現在のエイミング位置に該当するヒット領域を得る
	 * @returns
	 */
	GetCurrentArea(){
		if(this.currentArea==null)	this.UpdateCurrentArea();
		return this.currentArea;
	}

	/** 現在のヒット領域を更新
	 * @private
	 * @returns this */
	UpdateCurrentArea(isForce=true){
		if(isForce || this.currentArea==null)	this.currentArea	= this.GetArea(this.position);
		return this;
	}

	/** ヒット領域を初期化
	 * @returns this
	 */
	InitHitAreas(){
		this.hitAreas	= [];
		return this;
	}

	SetVisible(isVisible,isGradually=false){
		if(isVisible != this.isVisible){
			if(isVisible)	this.opacity	= isGradually ? 0 : 255;
			else			this.opacity	= isGradually ? 255 : 0;
		}

		this.isVisible	= isVisible;
		this.sprites.bar.SetVisible(true).SetOpacity(this.opacity);
		this.sprites.cursor.SetVisible(true).SetOpacity(this.opacity);
		return this;
	}

	/** コンストラクタのラッパ
	 * @static
	 * @memberof Aiming
	 */
	static Create(){return new this;}

	/** エイミング精度の表示
	 * @param {number} x
	 * @param {number} y
	 * @returns this
	 */
	SpawnRateValue(x,y){
		const rate	= Math.trunc(this.GetRate(true) * 10);
		//					百			十				一				小数点		小数部		％
		const indexes	= [	1,			rate%1000/100,	rate%100/10,	10,			rate%10,	11,			];
		const adjusts	= [	{x:0,y:0},	{x:16,y:1},		{x:31,y:2},		{x:42,y:3},	{x:52,y:4},	{x:64,y:5},	];

		this.sprites.rates.forEach((sprite,i)=>{
			sprite
				.SetPosition(x+adjusts[i].x,y+adjusts[i].y)
				.SetScale(0.75-0.05*i)
				.SetRotate(-5)
				.SetIndex(Math.trunc(indexes[i]))
				.SetVisible(i==0?(rate>=1000) : i==1?(rate>=100) : true)
				.SetOpacity(0)
				.RunActions(
					cc.delayTime(0.1*i),
					[
						cc.fadeTo(0.3,255),
						cc.jumpBy(0.5,cc.p(0,0),16-i,1),
					]
				);
		});
		return this;
	}

	/** エイミング精度を非表示
	 * @returns this
	 */
	HideRateValue(){
		this.sprites.rates.forEach( s=>s.SetVisible(false) );
		return this;
	}
}


})();	//File Scope