var Label;

(function(){	//File Scope

/** cc.LabelXXXのラッパクラス
 * @class Label
 */
Label	= class Label{

	constructor(text,fontName,fontSize){
		/** @const Z座標 */
		this.Z	= 65535;

		this.entity	= cc.LabelTTF.create(text,fontName,fontSize);
		this.entity.attr({zIndex:this.Z});

		//背景
		this.bg	= new LabelBg(this);
	}

	/** インスタンス生成
	 * @static
	 * @returns
	 * @memberof Labe;
	 */
	static CreateInstance(fontSize=16,fontName=""){
		return new Label("",fontName,fontSize);
	}

	/** 初期化
	 * @returns {this}
	 * @memberof Label
	 */
	Init(){
		if(this.bg.IsEnabled())	this.bg.Init();
		return this;
	}

	/** インスタンス取得
	 * @returns cc.LabelAtlas
	 * @memberof Label
	 */
	GetInstance(){
		return this.entity;
	}

	/** 可視設定
	 * @param {boolean} visible
	 * @returns {this}
	 * @memberof Label
	 */
	SetVisible(visible){
		this.entity.setVisible(!!visible);
		return this;
	}

	/** 更新 */
	Update(dt){
		let visible	= true;	//背景アニメ中は表示しない

		if(this.bg.IsEnabled()){
			this.bg.Update();
			if(this.bg.entity.getNumberOfRunningActions()>0) visible=false;
		}
		if(visible)	this.entity.attr({opacity:255});
		return this;
	}

	/** ラベルのサイズを取得
	 * @returns {this}
	 * @memberof Label
	 */
	GetContentSize(){
		return this.entity.getContentSize();
	}

	/** レイヤに自身を追加
	 * @param {Number} idx
	 * @param {*} layer
	 * @returns this
	 * @memberof Label
	 */
	AddToLayer(layer){
		this.entity.removeFromParent();
		layer.addChild(this.entity);
		if(this.bg.IsEnabled())	this.bg.ApplicateLayer();
		return this;
	}

	/** 座標設定
	 * @param {numver} x
	 * @param {number} y
	 * @returns
	 * @memberof Label
	 */
	SetPosition(x,y){
		this.entity.setPosition(x,y);
		if(this.bg.IsEnabled())	this.bg.ApplicatePosition();

		return this;
	}

	/** 背景の有効化/無効化
	 * @param {boolean} isEnabled
	 * @returns {this}
	 * @memberof Label
	 */
	SetBgEnabled(isEnabled){
		this.bg.SetEnabled(isEnabled);
		return this;
	}

	/** テキスト設定
	 * @param {string} text
	 * @returns
	 * @memberof Label
	 */
	SetString(text){
		this.entity.setString(text);
		if(this.bg.IsEnabled()){
			this.entity.attr({opacity:0});
			this.bg.SetSize();
		}
		return this;
	}

	/** カラー設定
	 * @param {strinf|cc.color} color
	 * @returns
	 * @memberof Label
	 */
	SetColor(color){
		this.entity.setColor( typeof color==='string'?cc.color(color):color );
		return this;
	}

};


//ラベル背景
class LabelBg{

	constructor(parent){
		/** @var 紐付いているLabel */
		this.parent		= parent;
		/** @const 描画するZ座標*/
		this.Z			= this.parent.Z - 1;
		/** @const 不透明度 */
		this.OPACITY	= 128;
		/** @const 背景色 */
		this.COLOR		= new cc.color(0,0,0);
		/** @const パディング  */
		this.PADDING	= { horizon:4,	vertical:2	};

		/** @var cc.DwarNodeクラスのインスタンス */
		this.entity	= null;
		/** @var サイズ */
		this.size			= {width:0,					height:0,					};
		/** @var サイズ上限*/
		this.upper			= {width:null,				height:null,				};
		/** @var サイズ下限*/
		this.lower			= {width:0,					height:0,					};

		this.imgWidth	= 128;
		this.imgHeight	= 128;

		this.Init();
	}

	/** 初期化
	 * @returns {this}
	 * @memberof LabelBg
	 */
	Init(){
		this.SetSize(0,0,false,false);
		return this;
	}

	/** 背景インスタンスの生成
	 * @returns {this}
	 * @memberof LabelBg
	 */
	Create(){
		if(this.entity)	this.entity.clear();

		this.entity		= new cc.Sprite(`${rc.DIRECTORY}${rc.sysImg.labelBg}`);
		this.imgWidth	= this.entity.getContentSize().width;
		this.imgHeight	= this.entity.getContentSize().height;
		this.entity.setColor(this.COLOR);
		this.entity.setScale(0);
		this.entity.attr({zIndex:this.Z, opacity:this.OPACITY, });

		this.Init().ApplicateLayer();
		return this;
	}

	/** 更新
	 * @param {*} dt
	 * @returns
	 * @memberof LabelBg
	 */
	Update(dt){
		return this;
	}

	/** 背景を有効化/無効化する
	 * @param {*} isEnabled
	 * @returns
	 * @memberof LabelBg
	 */
	SetEnabled(isEnabled){
		if(!isEnabled){
			this.entity	= null;
			return this;
		}

		if(this.entity == null)	this.Create();
		return this;
	}

	/** 背景が有効なら真
	 * @returns boolean
	 * @memberof LabelBg
	 */
	IsEnabled(){
		return this.entity!=null;
	}

	/**背景サイズ設定
	 * @param {number|null|undefined} [width=undefined]		幅。未指定で自動設定、nullで変更なし。
	 * @param {number|null|undefined} [height=undefined]	高さ。未指定で自動設定、nullで変更なし。
	 * @param {boolean} [animates=true]						イージング処理を使用する。
	 * @param {boolean} [pads=true]							パディング値を考慮する。
	 * @returns this
	 * @memberof LabelBg
	 */
	SetSize(width=undefined,height=undefined,animates=true,pads=true){
		let parentSize	= this.parent.GetContentSize();

		//パディング
		const adjust	= {
			width:	pads	? this.PADDING.horizon  * 2	: 0,
			height:	pads	? this.PADDING.vertical * 2	: 0,
		};

		//引数が未指定(undefined)時はラベル文字列から取得、null時は変更なし
		this.size.width		= width === undefined	? parentSize.width +adjust.width	:
							  width === null		? this.size.width					: width +adjust.width;
		this.size.height	= height=== undefined	? parentSize.height+adjust.height	:
							  height=== null		? this.size.height					: height+adjust.height;

		//Clamp
		this.size.width		= Clamp(this.size.width	,this.lower.width, this.upper.width);
		this.size.height	= Clamp(this.size.height,this.lower.height,this.upper.height)

		if(!this.IsEnabled())	return this;

		//イージング処理
		if(animates){
			this.entity.runAction(
				cc.ScaleTo
					.create(0.5,this.size.width/this.imgWidth, this.size.height/this.imgHeight)
					.easing(cc.easeBackOut(10))
			);
		}
		else{
			this.entity.setScale(this.size.width/this.imgWidth, this.size.height/this.imgHeight);
		}

		this.ApplicatePosition();
		return this;
	}

	/** 背景サイズの下限＆上限設定。nullは限界なし
	 * @param {*} [lowerWidth=null] 幅の下限
	 * @param {*} [lowerHeight=null] 高さの下限
	 * @param {*} [upperWidth=null] 幅の上限
	 * @param {*} [upperHeight=null] 高さの上限
	 * @returns this
	 * @memberof LabelBg
	 */
	SetLimitSize(lowerWidth=null,lowerHeight=null,upperWidth=null,upperHeight=null){
		this.lower.width	= lowerWidth >0	? lowerWidth	: null;
		this.upper.width	= lowerHeight>0	? lowerHeight	: null;
		this.lower.height	= upperWidth >0	? upperWidth	: null;
		this.upper.height	= upperHeight>0	? upperHeight	: null;
		return this;
	}

	/** 背景座標を更新
	 * @returns
	 * @memberof LabelBg
	 */
	ApplicatePosition(){
		if(!this.IsEnabled())	return this;

		let pos	= this.parent.entity.getPosition();
		this.entity.setPosition(pos.x,pos.y+3);
		return this;
	}

	/** 背景の描画レイヤを更新
	 * @returns
	 * @memberof LabelBg
	 */
	ApplicateLayer(){
		let layer	= this.parent.entity.getParent();
		if(this.entity && layer){
			this.entity.removeFromParent();
			layer.addChild(this.entity);
		}
		return this;
	}
}


})();	//File Scope
