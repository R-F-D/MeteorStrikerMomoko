var Button	= Button||{};
(function(){	//File Scope

/********************************************************************************
 * ButtonItemクラスのコンテナ
 * @class Button
 ********************************************************************************/
Button	= class Button{

	constructor(nItems=1){
		this.items	= [];
		for(let i=0; i<nItems; ++i){
			this.items[i]	= new ButtonItem(this);
		}

		this.x	= 0;
		this.y	= 0;
		this.layer	= null;
		this.listener	- null;
	}

	/** インスタンス生成
	 * @static
	 * @returns
	 * @memberof Button
	 */
	static CreateInstance(nItems){
		return new this(nItems);
	}

	/** レイヤに自身を追加
	 * @param {Number} idx
	 * @param {*} layer
	 * @returns this
	 * @memberof Button
	 */
	AddToLayer(layer){
		if(layer==null)	return this;
		this.layer	= layer;
		this.forEach(v=>v.AddToLayer(layer));
		return this;
	}

	/** 初期化
	 * @returns this
	 */
	Init(){
		this.forEach(v=>v.Init());
		return this;
	}

	/** 任意の要素を１つ取り出す
	 * @param {number} idx インデックス
	 * @returns this
	 */
	at(idx){
		return this.items[idx];
	}

	/** forEachのラッパ
	 * @param {function} predicate 述語関数
	 * @returns this
	 */
	forEach(predicate){
		this.items.forEach(predicate);
		return this;
	}

	FindWithTag(tag){
		return this.items.find(v=>v.tag===tag);
	}

	/** 座標を設定
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @returns this
	 */
	SetPosition(x,y){
		this.x	= x;
		this.y	= y;
		this.items.forEach(v=>v.Move(0,0));	//ButtonItem側でコンテナの座標を加算するためButtonItemは動かさない
		return this;
	}

	/** 相対座標を設定
	 * @param {number} x x増分
	 * @param {number} y y増分
	 * @returns this
	 */
	Move(x,y){
		return this.SetPosition(this.x+x,this.y+y);
	}

}

/********************************************************************************
 * 画像ボタンクラス
 * @class ButtonItem
 ********************************************************************************/
class ButtonItem{
	/** コンストラクタ
	 * @param {Button} container 紐付けするコンテナクラス
	 * @memberof ButtonItem
	 */
	constructor(container){		
		this.sprite		= null;
		this.container	= container;
		this.x	= 0;
		this.y	= 0;
		this.layer	- null;

		this.SetTag();
	}

	/**レイヤに自身を追加*/
	AddToLayer(layer){
		this.layer	= layer;
		if(!this.sprite)	return this;

		this.sprite.removeFromParent();
		layer.addChild(this.sprite);	
		this.Apply();		
		return this;
	}

	/**初期化*/
	Init(){
	//	this.entity.setScale(1);
	//	this.entity.setContentSize(64,64);
		//this.entity.setSwallowTouches(false);
		return this;
	}

	CreateSprite(res){
		this.sprite	= Sprite.CreateInstance(res);
		this.Apply();
		return this;
	}

	Apply(){
		if(!this.sprite)	return this;

		this.sprite
			.SetPosition(this.container.x+this.x,this.container.y+this.y)
			.AddToLayer(this.container.layer);
		this.AddEvent(this.listener);
		return this;
	}

	/**座標を設定*/
	SetPosition(x,y){
		this.x	= x;
		this.y	= y;
		return this.Apply();
	}
	/**相対座標を設定*/
	Move(x,y){
		return this.SetPosition(this.x+x,this.y+y);
	}

	/** 検索用タグ
	 * @param {string?} [tag=null] タグ設定、省略時タグ削除
	 * @returns {this}
	 * @memberof ButtonItem
	 */
	SetTag(tag=null){
		this.tag	= tag;
		return this;
	}

	AddEvent(listener){
		if(listener==null)	return this;
		this.listener	= listener;
		if(!this.sprite)	return this;

		cc.eventManager.addListener(listener,this.sprite.entity);
		return this;
	}

	/*
	OnTouchEnded(onTouchEnded){
		let listener	= (sender,type)=>{
			if (type===ccui.Widget.TOUCH_ENDED)	onTouchEnded();
			return true;
		};
		this.AddEvent(listener);
		return this;
	}
	*/
}

})();	//File Scope
