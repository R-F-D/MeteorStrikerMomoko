/** cc.Spriteのラッパクラス
 * @class Sprite
 */
class Sprite{

	constructor(img){
		this.img			= img;
		this.currentIndex	= -1;
		this.entity			= new cc.Sprite(img.path);
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
			console.log("Update Texture Rect");
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
}
