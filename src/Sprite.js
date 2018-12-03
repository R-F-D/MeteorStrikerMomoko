/** cc.Spriteのラッパクラス
 * @class Sprite
 */
class Sprite{

	constructor(img){
		//座標
		/** @var X座標 */
		this.x				= 0;
		/** @var Y座標*/
		this.y				= 0;
		/** @var 極座標の径 */
		this.polarRadius	= 0;
		/** @var 極座標の偏角 */
		this.polaerAngle	= 0;

		//回転
		/** @var 回転角度(0-360) */
		this.angle			= 0;

		//スプライト本体
		/** @var 並列画像のインデックス */
		this.currentIndex	= -1;
		/** @var cc.Spriteクラスのインスタンス */
		this.entity			= new cc.Sprite(`${rc.DIRECTORY}${img[0]}`);

		/** @var 画像リソース */
		this.img	= {
			"path"		: img[0],
			"nSplitX"	: img[1] || 1,
			"nSplitY"	: img[2] || 1,
		};
		this.img.width		= this.entity.getContentSize().width;
		this.img.height		= this.entity.getContentSize().height;

		/* @var カスタムデータ */
		this.data	= {};

		//初期化
		this.setIndex(0);
	}

	/** インスタンス生成
	 * @static
	 * @param {*} img
	 * @returns
	 * @memberof Sprite
	 */
	static CreateInstance(img){
		return new Sprite(img);
	}

	/** インスタンス取得
	 * @returns
	 * @memberof Sprite
	 */
	GetInstance(){
		return this.entity;
	}

	/** 座標設定
	 * @param {number} x 直交座標、または極座標の原点でのx。null時は設定しない。
	 * @param {number} y 直交座標、または極座標の原点でのy。null時は設定しない。
	 * @param {number} [a=null] 極座標の偏角。null時は設定しない。
	 * @param {number} [r=null] 極座標の半径。null時は設定しない。
	 * @returns this
	 * @memberof Sprite
	 */
	SetPosition(x,y,a=null,r=null){
		this.x				= x!=null	? x	: this.x;
		this.y				= y!=null	? y	: this.y;
		this.polaerAngle	= a!=null	? a	: this.polaerAngle;
		this.polarRadius	= r!=null	? r	: this.polarRadius;

		if(this.polarRadius==0){
			this.entity.attr({	x:this.x,	y:this.y,	});
		}
		else{
			this.entity.attr({
				x	: this.x + Math.cos(this.polaerAngle) *this.polarRadius,
				y	: this.y + Math.sin(this.polaerAngle) *this.polarRadius,
			});
		}
		return this;
	}

	/** 画像の回転角度を設定
	 * @param {number} angle 回転角度
	 * @returns this
	 * @memberof Sprite
	 */
	SetRotate(angle){
		this.angle	= Cycle(angle,0,360);
		return this.Attr({rotation:this.angle});
	}
	/** 画像を回転させる
	 * @param {number} increment 角度の増分
	 * @returns this
	 * @memberof Sprite
	 */
	Rotate(increment){return this.SetRotate(this.angle+increment);}

	/** スケール設定
	 * @param {number} rate
	 * @returns {this}
	 * @memberof Sprite
	 */
	SetScale(rate){return this.Attr({scale:rate});}

	/** 不透明度
	 * @param {number} opac 0-255
	 * @returns {ths} this
	 * @memberof Sprite
	 */
	SetOpacity(opac){return this.Attr({opacity:opac});}

	/** テクスチャの色設定
	 * @param {string} color
	 * @returns {this} this
	 * @memberof Sprite
	 */
	SetColor(color){
		this.entity.setColor( typeof color==='string'?cc.color(color):color );
		return this;
	}


	/** cc.Sprite.attrのラッパ
	 * @param {*} attr
	 * @returns this
	 * @memberof Sprite
	 */
	Attr(attr){
		this.entity.attr(attr);
		return this;
	}

	/** レイヤに自身を追加
	 * @param {*} layer
	 * @returns this
	 * @memberof Sprite
	 */
	AddToLayer(layer){
		this.entity.removeFromParent();
		layer.addChild(this.entity);
		return this;
	}

	/** イベントリスナを追加
	 * @param {*} listener
	 * @returns this
	 * @memberof Sprite
	 */
	AddEventListener(listener){
		cc.eventManager.addListener(listener,this.entity);
		return this;
	}

	/** マルチ画像スプライトで表示インデックスをセットする
	 * @param {*} idx
	 * @returns this
	 * @memberof Sprite
	 */
	setIndex(idx){
		if(this.currentIndex===idx)	return this;

		if(this.img.width>0 && this.img.height>0 && this.img.nSplitX>0 && this.img.nSplitY>0){
			const x	= parseInt( idx % this.img.nSplitX );
			const y	= parseInt( idx / this.img.nSplitX );
			const w	= parseInt( this.img.width /this.img.nSplitX );
			const h	= parseInt( this.img.height/this.img.nSplitY );

			this.entity.setTextureRect(cc.rect( x*w, y*h, w, h)	);
			this.currentIndex	= idx;
		}
		else{
			this.currentIndex	= 0;
		}
		return this;
	}

	GetCustomData(key){return this.data[key]}
	SetCustomData(key,value){
		if(value===undefined)	delete this.data[key];
		else					this.data[key]	= value;
		return this;
	}
}
