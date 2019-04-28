var Button	= Button||{};
(function(){	//File Scope

/** ccui,Buttonのラッパクラス
 * @class Button
 */
Button	= class Button{


	constructor(nItems=1){
		this.items	= [];
		for(let i=0; i<nItems; ++i){
			this.items[i]	= new ButtonItem();
		}
	}

	/** インスタンス生成
	 * @static
	 * @returns
	 * @memberof Labe;
	 */
	static CreateInstance(){
		return new this();
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

	Init(){
		this.forEach(v=>v.Init());
		return this;
	}

	at(idx){
		return this.items[i];
	}
	forEach(predicate){
		this.items.forEach(predicate);
		return this;
	}

}

class ButtonItem{
	constructor(){
		this.entity	= new ccui.Button(`${rc.DIRECTORY}${rc.sysImg.labelBg}`);
	}

	AddToLayer(layer){
		this.entity.removeFromParent();
		//this.entity.addTouchEventListener(listeners[i],layer);
		layer.addChild(this.entity);
		return this;
	}

	Init(){
		this.entity.setScale(1);
		this.entity.setContentSize(64,64);
		//this.entity..setSwallowTouches(false);
		return this;
	}

	SetPosition(x,y){
		this.entity.SetPosition(x,y);
	}
}

})();	//File Scope
