/** cc.Spriteのラッパクラス
 * @class Sprite
 */
class Sprite{

	constructor(img){
		this.entities	= [];
		let rect		= null;

		if(img.width>0 && img.height>0 && img.nSplitX>0 && img.nSplitY>0){
			const widthPerPiece		= parseInt( img.width /img.nSplitX );
			const heightPerPiece	= parseInt( img.height/img.nSplitY );

			for(let i=0;i<img.nSplitX;++i){
				for(let j=0;j<img.nSplitY;++j){
					rect	= cc.rect( i*widthPerPiece, j*heightPerPiece, widthPerPiece, heightPerPiece	);
					this.entities.push(new cc.Sprite(img.path,rect));
				}
			}
		}
		else{
			this.entities[0]	= new cc.Sprite(img.path);
		}
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
	 * @param {number} [idx=0]
	 * @returns
	 * @memberof Sprite
	 */
	GetInstance(idx=0){
		return this.entities[idx];
	}

	/** cc.Sprite.attrのラッパ
	 * @param {Number} idx
	 * @param {*} attr
	 * @returns this
	 * @memberof Sprite
	 */
	Attr(idx,attr){
		this.entities[idx].attr(attr);
		return this;
	}

	/** レイヤに自身を追加
	 * @param {Number} idx
	 * @param {*} layer
	 * @returns this
	 * @memberof Sprite
	 */
	AddToLayer(idx,layer){
		layer.addChild(this.entities[idx]);
		return this;
	}

	/** イベントリスナを追加
	 * @param {Number} idx
	 * @param {*} listener
	 * @returns this
	 * @memberof Sprite
	 */
	AddEventListener(idx,listener){
		cc.eventManager.addListener(listener,this.entities[idx]);
		return this;
	}
}
