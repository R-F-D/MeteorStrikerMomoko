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
		this.entity			= new cc.Sprite(`${rc.DIRECTORY}Img/${img[0]}`);

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
		this.SetIndex(0);
		this.entity.getTexture().setAliasTexParameters();	//アンチエイリアスOFF
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

	/** 座標設定（絶対座標）
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

	SetPositionLT(x,y){
		const size	= this.GetPieceSize();
		this.SetPosition(x+size.width/2,y-size.height/2);
		return this;
	}

	/** 座標設定（相対座標）
	 * @param {number} x 直交座標、または極座標の原点でのx増分。null時は変更しない。
	 * @param {number} y 直交座標、または極座標の原点でのy増分。null時は変更しない。
	 * @param {number} [a=null] 極座標の偏角増分。null時は変更しない。
	 * @param {number} [r=null] 極座標の半径増分。null時は変更しない。
	 * @returns this
	 * @memberof Sprite
	 */
	SetRelativePosition(x,y,a=null,r=null){
		x	= x!=null	? x+this.x				: null;
		y	= y!=null	? y+this.y				: null;
		a	= a!=null	? a+this.polaerAngle	: null;
		r	= r!=null	? r+this.polarRadius	: null;

		return this.SetPosition(x,y,a,r);
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
	/** スプライトの回転角度を得る
	 * @returns {number} 0-360
	 * @memberof Sprite
	 */
	GetRotate(){return this.angle;}

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
	SetOpacity(opac){return this.Attr({opacity:Clamp(opac,0,255)});}

	/** 可視設定
	 * @param {boolean} visible
	 * @returns {this}
	 * @memberof Sprite
	 */
	SetVisible(visible){
		this.entity.setVisible(!!visible);
		return this;
	}
	get visible(){return !!this.entity.isVisible();}

	/** テクスチャの色設定
	 * @param {string} color
	 * @returns {this} this
	 * @memberof Sprite
	 */
	SetColor(color){
		this.entity.setColor( typeof color==='string'?cc.color(color):color );
		return this;
	}

	/** ブレンドモード設定
	 * @param {*} mode cc.BlendFunc.xxx
	 * @returns {this}
	 * @memberof Sprite
	 */
	SetBlend(mode){
		this.entity.setBlendFunc(mode);
		return this;
	}
	/** ブレンドモードを加算に設定
	 * @returns {this}
	 * @memberof Sprite
	 */
	EnableAdditiveBlend(){
		return this.SetBlend(cc.BlendFunc.ADDITIVE);
	}
	/** ブレンドモード初期化
	 * @returns {this}
	 * @memberof Sprite
	 */
	InitBlend(){
		return this.SetBlend(cc.BlendFunc.ALPHA_NON_PREMULTIPLIED);
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
		if(!layer)	return this;
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
	SetIndex(idx){
		if(this.currentIndex===idx)	return this;

		if(this.img.width>0 && this.img.height>0 && this.img.nSplitX>0 && this.img.nSplitY>0){
			const x			= Math.trunc( idx % this.img.nSplitX );
			const y			= Math.trunc( idx / this.img.nSplitX );
			const pieceSize	= this.GetPieceSize();

			this.entity.setTextureRect(cc.rect( x*pieceSize.width, y*pieceSize.height, pieceSize.width, pieceSize.height)	);
			this.currentIndex	= idx;
		}
		else{
			this.currentIndex	= 0;
		}
		return this;
	}

	GetCustomData(key,defaultValue=undefined){
		return key in this.data	? this.data[key]	: defaultValue;
	}
	SetCustomData(key,value){
		if(value===undefined)	delete this.data[key];
		else					this.data[key]	= value;
		return this;
	}

	/** アクション設定
	 * @param {Action|Acrion[]} actions 可変長引数。アクション、またはアクションの配列（並列処理扱い）
	 * @returns this
	 * @memberof Sprite
	 */
	RunActions(...actions){
		this.entity.RunActions(...actions);
		return this;
	}
	StopActions(){
		this.entity.stopAllActions();
		return this;
	}

	/** 実行中のアクションがあるか
	 * @returns {boolean}
	 */
	IsRunningActions(){
		if(this.entity.getNumberOfRunningActions()>0) return true;
		return false;
	}

	/** 分割画像のサイズを取得
	 * @memberof Sprite
	 */
	GetPieceSize(){
		return {
			width:	Math.trunc( this.img.width /this.img.nSplitX ),
			height:	Math.trunc( this.img.height/this.img.nSplitY ),
		};
	}


}
