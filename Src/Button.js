var cc;
var DefinedOr;
var Button	= Button||{};
(function(){	//File Scope

/********************************************************************************
 * ButtonItemクラスのコンテナ
 * @class Button
 ********************************************************************************/
Button	= class Button{

	static get OFF() 	{return 0x01}
	static get ON()		{return 0x02}
	static get HOVER()	{return 0x04}

	constructor(nItems=1){
		this.items	= [];
		for(let i=0; i<nItems; ++i){
			this.items[i]	= new ButtonItem(this);
			this.items[i].idx	= i;
		}

		this.x	= 0;
		this.y	= 0;
		this.scale	= 1.0;
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
		if(!layer)	return this;
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
	 * @param {number|string} idx インデックスまたはタグ名
	 * @returns this
	 */
	at(idx){
		if(Number.isInteger(idx))	return this.items[idx];
		else						return this.FindWithTag(idx);
	}

	/** forEachのラッパ
	 * @param {function} predicate 述語関数
	 * @returns this
	 */
	forEach(predicate){
		this.items.forEach(predicate);
		return this;
	}

	/** filterのラッパ
	 * @param {function} callback コルバック。真を返した要素のみ抽出される。
	 * @returns ButtonItem[]
	 */
	filter(callback){
		return this.items.filter(callback);
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

	SetScale(scale=1.0){
		this.scale=scale;
		this.items.forEach(b=>b.SetScale(null));
		return this;
	}

	SetVisible(visible){
		this.items.forEach(b=>b.SetVisible(!!visible));
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

	/** 更新
	 * @returns this
	 */
	Update(dt){
		this.items.forEach(v=>v.Update(dt));
		return this;
	}

	SetTags(...tags){
		if(Array.isArray(tags[0]))	tags = tags[0];
		this.items.forEach((v,i)=>{
			if(i<tags.length)	v.SetTag(tags[i]);
		});
		return this;
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
		this.label		= null;
		this.container	= container;
		this.x	= 0;
		this.y	= 0;
		this.Z	= 0x0100;
		this.polaerAngle	= 0;
		this.polarRadius	= 0;
		this.layer	- null;
		this.scale	= 1.0;
		this.scaleOnActive	= 0.9;
		this.opacity		= 255;
		this.opacityOnHover	= 255;
		this.color			= {r:0xFF,g:0xFF,b:0xFF,};
		this.colorOnHover	= this.color;
		this.indexes	= {};
		this.status		= Button.OFF;
		this.listensButtonUp	= false;
		this.keyCodes	= [];
		this._autoOff	= false;

		this.idx		= null;
		this.SetTag();
	}

	/**レイヤに自身を追加*/
	AddToLayer(layer){
		if(!layer)	return this;
		this.layer	= layer;
		if(!this.sprite)	return this;

		this.sprite.removeFromParent();
		layer.addChild(this.sprite);
		this.Apply();
		return this;
	}

	CreateSprite(res){
		this.sprite	= Sprite.CreateInstance(res);
		this.Apply();
		return this;
	}
	CreateLabel(fontSize=16,font=""){
		this.label	= Label.CreateInstance(fontSize,font);
		this.Apply();
		return this;
	}

	Apply(){
		if(this.sprite){
			this.sprite
				.AddToLayer(this.container.layer)
				.Attr({zIndex:this.Z})
				.SetPosition(this.container.x+this.x,this.container.y+this.y,this.polaerAngle,this.polarRadius)
				.SetOpacity(this.opacity);
		}
		if(this.label){
			this.label
				.AddToLayer(this.container.layer)
				.SetPosition(this.container.x+this.x,this.container.y+this.y,this.polaerAngle,this.polarRadius);
		}

		this._ApplyEvents();
		return this;
	}

	/**座標を設定*/
	SetPosition(x,y,a=null,r=null){
		this.x				= x!=null	? x	: this.x;
		this.y				= y!=null	? y	: this.y;
		this.polaerAngle	= a!=null	? a	: this.polaerAngle;
		this.polarRadius	= r!=null	? r	: this.polarRadius;
		return this.Apply();
	}
	/**相対座標を設定*/
	Move(x,y){
		return this.SetPosition(this.x+x,this.y+y);
	}

	/** 表示設定 */
	SetVisible(isVisible){
		if(this.sprite)	this.sprite.SetVisible(isVisible);
		return this;
	}

	/** 画像のインデックス */
	SetIndex(status,idx){
		let stattuses	= [status];
		if(idx===undefined)	{
			stattuses	= [Button.OFF,Button.ON,Button.HOVER];
			idx			= status;
		}

		this.indexes	= this.indexes||{};
		stattuses.forEach(s=>	this.indexes[s] = idx	);
		return this._ApplyIndex();
	}
	_ApplyIndex(){
		let idx = this.indexes[this.status] || this.indexes[Button.OFF] || 0;
		this.sprite.SetIndex(idx);
		return this;
	}

	/**拡大率設定*/
	SetScale(scale,isTemp=false){
		scale = DefinedOr(scale,this.scale,1.0);
		if(!isTemp)	this.scale = scale;
		if(this.sprite)	this.sprite.SetScale(scale*this.container.scale);
		if(this.label)	this.label.entity.setScale(scale*this.container.scale);
		return this;
	}

	/** 不透明度設定 */
	SetOpacity(opacity,isSlowly=false,isTemp=false){
		opacity	= DefinedOr(opacity,this.opacity,255);
		if(!isTemp)	this.opacity = opacity;
		if(!isSlowly)	this.sprite.SetOpacity(opacity);
		else			this.sprite.RunActions(cc.fadeTo(0.2,opacity));
		return this;
	}

	/**画像のカラー設定*/
	SetColor(color,isSlowly=false,isTemp=false){
		if(Array.isArray(color))	color = {r:color[0],g:color[1],b:color[2],};
		color.r	= DefinedOr( color.r, this.color.r, 255);
		color.g	= DefinedOr( color.g, this.color.g, 255);
		color.b	= DefinedOr( color.b, this.color.b, 255);

		if(!isTemp)	this.color = {r:color.r,g:color.g,b:color.b,};
		if(!isSlowly)	this.sprite.SetColor(cc.color(color.r,color.g,color.b,0xFF));
		else			this.sprite.RunActions(cc.tintTo(0.2,color.r,color.g,color.b));
		return this;
	}
	SetColorOnHover(color){
		if(Array.isArray(color))	color = {r:color[0],g:color[1],b:color[2],};
		this.colorOnHover	= {
			r	: DefinedOr( color.r, this.colorOnHover.r, 255),
			g	: DefinedOr( color.g, this.colorOnHover.g, 255),
			b	: DefinedOr( color.b, this.colorOnHover.b, 255),
		}
		return this;
	}

	/**ラベルの文字列設定*/
	SetLabelText(text){
		if(this.label){
			this.label
				.SetNumLogLines(text.split(/\n/).length)
				.SetString(text);
		}
		return this;
	}

	SetLabelColor(fill=null,stroke=null,width=null){
		if(this.label)	this.label.SetFontColor(fill,stroke,width);
		return this;
	}

	/** 検索用タグ */
	SetTag(tag=null){
		this.tag	= tag;
		return this;
	}

	/** イベントリスナ適用 */
	_ApplyEvents(){
		if(!this.sprite)	return this;
		this.listeners	= this.listeners || {};
		cc.eventManager.removeListeners(this.sprite.entity);

		//タッチ
		cc.eventManager.addListener(cc.EventListener.create({
			event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
			onTouchesBegan	: (touches,event)=>{
				if(!this.sprite.entity.isVisible())	return false;
				if(this._EventIsOnSprite(touches,event)){
					if(this.status!==Button.HOVER && this.listeners.onMouseOver)	this.listeners.onMouseOver();
					this.status			= Button.ON;
					this._ApplyIndex();
					event.stopPropagation();
					if(this.listeners.onTouchBegan)	this.listeners.onTouchBegan();
					this.SetScale(this.scale*this.scaleOnActive,true);
					this.SetOpacity(this.opacityOnHover,false,true);
					this.SetColor(this.colorOnHover,false,true);
				}
				return true;
			},
			onTouchesEnded	: (touches,event)=>{
				if(this.status==Button.ON){
					if(!this.sprite.entity.isVisible())	return false;
					if(this._EventIsOnSprite(touches,event)){
						event.stopPropagation();
						if(this.listeners.onTouchEnded)	this.listeners.onTouchEnded();
						if(this.listeners.onButtonUp)	this.listensButtonUp	= true;
						this.status			= Button.HOVER;
						this.SetOpacity(this.opacityOnHover,false,true)
							.SetColor(this.colorOnHover,false,true)
							.sprite.RunActions(cc.scaleTo(0.2,this.scale));
						if(this.label)	this.label.entity.RunActions(cc.scaleTo(0.2,this.scale));
					}
					else{
						if(this.listeners.onMouseOut)	this.listeners.onMouseOut();
						this.status			= Button.OFF;
						this.SetOpacity(this.opacity,true,false)
							.SetColor(this.color,true,false)
							.sprite.RunActions(cc.scaleTo(0.2,this.scale));
						if(this.label)	this.label.entity.RunActions(cc.scaleTo(0.2,this.scale));
					}
					this._ApplyIndex();
				}
			},
			onTouchesCanceled	: (touches,event)=>{
				this.sprite.RunActions(cc.scaleTo(0.2,this.scale));
				this.status			= Button.OFF;
				this.SetOpacity(this.opacity,true,false);
				this.SetColor(this.color,true,false);
				this._ApplyIndex();
				if(this.listeners.onMouseOut)	this.listeners.onMouseOut();
			}
		}),this.sprite.entity);

		//マウス
		cc.eventManager.addListener(cc.EventListener.create({
			event			: cc.EventListener.MOUSE,
			onMouseMove	: (event)=>{
				if(!this.sprite.entity.isVisible())	return false;
				if(this._EventIsOnSprite(null,event)){
					if(this.status & (Button.OFF|Button.HOVER)){
						if(this.status==Button.OFF && this.listeners.onMouseOver)	this.listeners.onMouseOver();
						this.status			= Button.HOVER;
						this._ApplyIndex();
						this.SetOpacity(this.opacityOnHover,false,true);
						this.SetColor(this.colorOnHover,false,true);
					}
				}
				else if(this.status==Button.HOVER){
					this.status			= Button.OFF;
					this.SetOpacity(this.opacity,true,false);
					this.SetColor(this.color,true,false);
					if(this.listeners.onMouseOut)	this.listeners.onMouseOut();
					this._ApplyIndex();
				}
				return;
			}
		}),this.sprite.entity);

		//キーボード
		if(cc.EventListener.KEYBOARD && this.keyCodes){

			cc.eventManager.addListener(cc.EventListener.create({
				event			: cc.EventListener.KEYBOARD,
				onKeyPressed	: (code,event)=>{
					if(this.keyCodes.includes(code)){
						event.stopPropagation();
						if(this.listeners.onTouchBegan)	this.listeners.onTouchBegan();
						this.SetScale(this.scale*this.scaleOnActive,true)
							.SetOpacity(this.opacityOnHover,false,true)
							.SetColor(this.colorOnHover,false,true);
					}
				},
				onKeyReleased	: (code,event)=>{
					if(this.keyCodes.includes(code)){
						event.stopPropagation();
						if(this.listeners.onTouchEnded)	this.listeners.onTouchEnded();
						if(this.listeners.onButtonUp)	this.listensButtonUp	= true;
						this.SetOpacity(this.opacity,true,false)
							.SetColor(this.color,true,false)
							.sprite.RunActions(cc.scaleTo(0.2,this.scale));
						if(this.label)	this.label.entity.RunActions(cc.scaleTo(0.2,this.scale));
						if(this.listeners.onMouseOut)	this.listeners.onMouseOut();
					}
				},
			}),this.sprite.entity);

		}

		return this;
	}

	/**イベントはスプライト上で発生しているか*/
	_EventIsOnSprite(touches,event){
		if(!Array.isArray(touches))	touches	= [touches];
		return !!touches.some(touch=>{
			const target		= event.getCurrentTarget();
			const location		= target.convertToNodeSpace( (touch||event).getLocation());
			const spriteSize	= target.getContentSize();
			const spriteRect	= this.status==Button.ON	? cc.rect(0,0,spriteSize.width,               spriteSize.height)
															: cc.rect(0,0,spriteSize.width*this.scaleOnActive,spriteSize.height*this.scaleOnActive);
			return !!cc.rectContainsPoint(spriteRect,location);
		});
	}

	Update(dt){
		if(this.listensButtonUp && this.listeners.onButtonUp && !this.sprite.IsRunningActions()){
			this.listeners.onButtonUp();
			this.listensButtonUp	= false;

			if(this._autoOff && this.status==Button.HOVER){
				this.status			= Button.OFF;
				this.SetOpacity(this.opacity,true,false);
				this.SetColor(this.color,true,false);
				if(this.listeners.onMouseOut)	this.listeners.onMouseOut();
				this._ApplyIndex();
			}
		}
		return this;
	}

	/** タッチ開始のコールバックを設定
	 * @param {function} [callback=null] コールバック関数
	 * @returns this
	 * @memberof ButtonItem
	 */
	OnTouchBegan(callback=null){
		this.listeners	= this.listeners||{};
		this.listeners.onTouchBegan	= callback;
		this._ApplyEvents();
		return this;
	}
	/** タッチ終了のコールバックを設定
	 * @param {function} [callback=null] コールバック関数
	 * @returns this
	 * @memberof ButtonItem
	 */
	OnTouchEnded(callback=null){
		this.listeners	= this.listeners||{};
		this.listeners.onTouchEnded	= callback;
		this._ApplyEvents();
		return this;
	}
	/** マウスホバーのコールバックを設定
	 * @param {function} [callbackOver=null] マウスオーバー時のコールバック関数
	 * @param {function} [callbackOut=null] コールバック関数
	 * @returns this
	 * @memberof ButtonItem
	 */
	OnMouseHover(callbackOver=null,callbackOut=null){
		this.listeners	= this.listeners||{};
		this.listeners.onMouseOver	= callbackOver;
		this.listeners.onMouseOut	= callbackOut;
		this._ApplyEvents();
		return this;
	}
	/** ボタンアップのコールバックを設定
	 * @param {function} [callback=null] コールバック関数
	 * @returns this
	 * @memberof ButtonItem
	 */
	OnButtonUp(callback=null){
		this.listeners	= this.listeners||{};
		this.listeners.onButtonUp	= callback;
		this._ApplyEvents();
		return this;
	}

	/** キーアサイン追加
	 * @param {number} keyCodes
	 * @returns this
	 * @memberof ButtonItem
	 */
	AssignKeyboard(...keyCodes){
		this.keyCodes	= keyCodes;
		return this;
	}

	SetAutoOff(flag){
		this._autoOff	= !!flag;
		return this;
	}
}

})();	//File Scope
