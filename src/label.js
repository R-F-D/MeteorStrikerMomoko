/** cc.LabelXXXのラッパクラス
 * @class Label
 */
class Label{

	constructor(text,fontName,fontSize){
		this.entity	= cc.LabelTTF.create(text,fontName,fontSize);
	}

	/** インスタンス生成
	 * @static
	 * @param {String} text
	 * @returns
	 * @memberof Labe;
	 */
	static CreateInstance(text="",fontSize=16,fontName="Arial"){
		return new Label(text,fontName,fontSize);
	}

	/** インスタンス取得
	 * @returns cc.LabelAtlas
	 * @memberof Label
	 */
	GetInstance(){
		return this.entity;
	}

	/** レイヤに自身を追加
	 * @param {Number} idx
	 * @param {*} layer
	 * @returns this
	 * @memberof Label
	 */
	AddToLayer(layer){
		layer.addChild(this.entity);
		return this;
	}

	setPosition(x,y)	{ this.entity.setPosition(x,y);	return this;	}
	setString(text)		{ this.entity.setString(text);	return this;	}
	setColor(color)		{ this.entity.setColor( typeof color==='string'?cc.color(color):color );	return this;	}

}
