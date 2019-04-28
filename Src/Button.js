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
	}

	/** インスタンス生成
	 * @static
	 * @returns
	 * @memberof Labe;
	 */
	static CreateInstance(nItems){
		return new this(nItems);
	}

	/** レイヤに自身を追加
	 * @param {Number} idx
	 * @param {*} layer
	 * @returns this
	 * @memberof Label
	 */
	AddToLayer(layer){
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
		return this.items[i];
	}

	/** forEachのラッパ
	 * @param {function} predicate 述語関数
	 * @returns this
	 */
	forEach(predicate){
		this.items.forEach(predicate);
		return this;
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
 * ccui.Buttonのラッパクラス
 * @class ButtonItem
 ********************************************************************************/
class ButtonItem{
	/** コンストラクタ
	 * @param {Button} container 紐付けするコンテナクラス
	 * @memberof ButtonItem
	 */
	constructor(container){		
		this.entity		= new ccui.Button(/*`${rc.DIRECTORY}${rc.sysImg.labelBg}`*/);
		this.container	= container;
		this.x	= 0;
		this.y	= 0;
	}

	/**レイヤに自身を追加*/
	AddToLayer(layer){
		this.entity.removeFromParent();
		//this.entity.addTouchEventListener(listeners[i],layer);
		layer.addChild(this.entity);
		return this;
	}

	/**初期化*/
	Init(){
		this.entity.setScale(1);
		this.entity.setContentSize(64,64);
		//this.entity..setSwallowTouches(false);
		return this;
	}

	/**座標を設定*/
	SetPosition(x,y){
		this.x	= x;
		this.y	= y;
		this.entity.setPosition(this.container.x+x,this.container.y+y);
		return this;
	}

	/**相対座標を設定*/
	Move(x,y){
		return this.SetPosition(this.x+x,this.y+y);
	}
}

})();	//File Scope
