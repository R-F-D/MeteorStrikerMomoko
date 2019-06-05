var Label;

(function(){	//File Scope

/** @const 背景アニメーションの種類 */
const BgAnimation	= {
	None	: 0x00,	//アニメーションなし
	Widen	: 0x01,	//拡大アニメーション
	Narrow	: 0x02,	//縮小アニメーション
};

/** cc.LabelXXXのラッパクラス
 * @class Label
 */
Label	= class Label{

	constructor(text,font,fontSize){
		/** @const Z座標 */
		this.Z	= 65535;

		this.text	= "";
		this.logs	= [];
		this.nLines	= 1;

		this.entity	= cc.LabelTTF.create(text, typeof font=='string'?font:font.Family, fontSize);
		this.entity.attr({zIndex:this.Z});

		//アイコン
		this.icon	= null;
		this.iconAdjust	= {x:0,y:0};

		//背景
		this.bg	= new LabelBg(this);
	}

	/** インスタンス生成
	 * @static
	 * @returns
	 * @memberof Labe;
	 */
	static CreateInstance(fontSize=16,font=""){
		return new Label("",font,fontSize);
	}

	/** 初期化
	 * @returns {this}
	 * @memberof Label
	 */
	Init(){
		if(this.icon)this.icon.Attr({opacity:0});
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
		if(!visible){
			this.text	= "";
			this.logs	= [];
		}
		this.entity.setVisible(!!visible);
		if(this.bg.IsEnabled()){
			if(visible)	{
				this.bg.entity.setVisible(true);
				this.bg.SetSize(true,undefined,undefined,false);
			}
			else{
				this.bg.SetSize(true,0,0,false);
			}
		}
		if(this.icon){
			this.icon.SetVisible(!!visible);
		}
		return this;
	}

	/** 可視状態を得る
	 * @returns {boolean}
	 * @memberof LabelBg
	 */
	IsVisible(){
		return this.entity.isVisible();
	}

	/** 更新 */
	Update(dt){
		if(this.bg.IsEnabled()){
			this.bg.Update();
		}
		//背景アニメーション中はテキストを表示しない
		if(!this.bg.IsRunningActions()){
			this.entity.attr({opacity:255});
			if(this.icon)	this.icon.Attr({opacity:192});
		}

		//ログの自動消去
		const length	= this.logs.length;
		if(length > 0){
			this.logs	= this.logs.filter(line=>{
				if(line.lifetime===null)	return true;
				line.lifetime	= Math.max(0,--line.lifetime);
				return line.lifetime > 0;
			});

			if     (this.logs.length==0)		this.SetString("").SetVisible(false);
			else if(this.logs.length!=length)	this.SetString(_(this.logs).map("line").join("\n"));
		}

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
		if(!layer)	return this;
		this.entity.removeFromParent();
		layer.addChild(this.entity);
		if(this.icon)	this.icon.AddToLayer(layer);

		if(this.bg.IsEnabled()){
			this.bg.ApplicateLayer();
		}

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
		this.ApplicateIconPosition();
		if(this.bg.IsEnabled())	this.bg.ApplicatePosition();

		return this;
	}

	/** アイコン位置の更新
	 * @returns {this}
	 */
	ApplicateIconPosition(){
		if(!this.icon)	return this;

		const pos		= this.entity.getPosition();
		const size		= this.GetContentSize();
		const imgSize	= this.icon.GetPieceSize();
		this.icon.SetPosition(	pos.x-(size.width+imgSize.width)/2+this.iconAdjust.x,	pos.y+this.iconAdjust.y	);

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
	SetString(text,isTemp=false){
		if(text==this.entity.getString()) return this;

		//表示行数の調整
		text	= (()=>{
			let lines	= text.split(/\n/).filter((v,i)=>i<this.nLines);
			for(let i=lines.length; i<this.nLines; ++i)	lines.push("");
			return lines.join("\n");
		})();

		if(!isTemp)	this.text = text;
		this.entity.setString(text);
		if(this.icon){
			this.ApplicateIconPosition();
			this.icon.Attr({opacity:0});
		}
		if(this.bg.IsEnabled()){
			this.entity.attr({opacity:0});
			this.bg.SetSize(true);
		}
		return this;
	}

	SetTempText(text){return this.SetString(text,true)}
	RemoveTempText(text){return this.SetString(this.text,false)}

	/** ログ形式のテキストを追加
	 * @param {string[]} lines 文字列の配列（1要素1行）
	 * @param {number|null} lifetime 自動消去までのフレーム数。デフォルト180。nullで消去しない。
	 * @returns
	 */
	PushLog(lines,lifetime=180){
		lines.split(/\n/).forEach(l=>this.logs.push( {line:l,lifetime:lifetime} ));
		while(this.logs.length > this.nLines)	this.logs.shift();
		this.SetString(_(this.logs).map("line").join("\n"));
		return this;
	}

	/** ログ形式のときの表示行数を設定
	 * @param {number} nLines 表示行数。省略時3
	 * @returns this
	 */
	SetNumLogLines(nLines=3){
		if(nLines>0)	this.nLines = nLines;
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

	/** アイコン画像のセット
	 * @param {*} img
	 * @returns {this}
	 */
	SetIcon(img){

		this.icon	= Sprite
						.CreateInstance(img)
						.Attr({opacity:0,zIndex:this.Z-1})
						.SetScale(1);

		let layer	= this.entity.getParent();
		if(layer)	this.icon.AddToLayer(layer);

		return this;
	}

	/** アイコン画像のインデックスを設定
	 * @param {number} [index=0] インデックス
	 * @returns this
	 */
	SetIconIndex(index=0){
		if(this.icon)	this.icon.SetIndex(index);
		return this;
	}

	/** アイコン画像の座標修正
	 * @param {number} [x=null]
	 * @param {number} [y=null]
	 * @returns this
	 */
	SetIconPosition(x=null,y=null){
		if(x!==null)	this.iconAdjust.x = x;
		if(y!==null)	this.iconAdjust.y = y;
		return this;
	}

};

//ラベル背景
class LabelBg{

	constructor(parent){
		/** @var 紐付いているLabel */
		this.parent		= parent;
		/** @const 描画するZ座標*/
		this.Z			= this.parent.Z - 2;
		/** @const 不透明度 */
		this.OPACITY	= 128;
		/** @const 背景色 */
		this.COLOR		= new cc.color(0,0,0);
		/** @const パディング  */
		this.PADDING	= { horizon:4,	vertical:2	};

		/** @var cc.DwarNodeクラスのインスタンス */
		this.entity		= null;
		/** @var サイズ */
		this.size		= {width:0,		height:0,	};
		/** @var サイズ上限*/
		this.upper		= {width:null,	height:null,};
		/** @var サイズ下限*/
		this.lower		= {width:0,		height:0,	};

		this.imgWidth	= 128;
		this.imgHeight	= 128;
		this.animation	= BgAnimation.None;

		this.Init();
	}

	/** 初期化
	 * @returns {this}
	 * @memberof LabelBg
	 */
	Init(){
		this.SetSize(false,0,0,false);
		return this;
	}

	/** 背景インスタンスの生成
	 * @returns {this}
	 * @memberof LabelBg
	 */
	Create(){
		if(this.entity)	this.entity.clear();

		this.entity		= new cc.Sprite(`${rc.DIRECTORY}${rc.sysImg.white}`);
		this.imgWidth	= this.entity.getContentSize().width;
		this.imgHeight	= this.entity.getContentSize().height;
		this.entity.setColor(this.COLOR);
		this.entity.setScale(0);
		this.entity.attr({zIndex:this.Z, opacity:this.OPACITY, });
		this.entity.setVisible(!!this.parent.entity.isVisible());

		this.Init().ApplicateLayer();
		return this;
	}

	/** 更新
	 * @param {*} dt
	 * @returns
	 * @memberof LabelBg
	 */
	Update(dt){
		if(!this.IsRunningActions()){
			this.animation	= BgAnimation.None;
		}
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
	 * @param {boolean} [animates=true]						イージング処理を使用する。
	 * @param {number|null|undefined} [width=undefined]		幅。未指定で自動設定、nullで変更なし。
	 * @param {number|null|undefined} [height=undefined]	高さ。未指定で自動設定、nullで変更なし。
	 * @param {boolean} [pads=true]							パディング値を考慮する。
	 * @returns this
	 * @memberof LabelBg
	 */
	SetSize(animates,width=undefined,height=undefined,pads=true){
		let parentSize	= this.parent.GetContentSize();

		//パディング
		const adjust	= {
			width:	pads	? this.PADDING.horizon  * 2	: 0,
			height:	pads	? this.PADDING.vertical * 2	: 0,
		};

		//引数が未指定(undefined)時はラベル文字列から取得、null時は変更なし
		this.size.width		= width === null		? this.size.width					:
							  width === undefined	? parentSize.width +adjust.width	: width +adjust.width;
		this.size.height	= height=== null		? this.size.height					:
							  height=== undefined	? parentSize.height+adjust.height	: height+adjust.height;

		//Clamp
		this.size.width		= Clamp(this.size.width	,this.lower.width, this.upper.width);
		this.size.height	= Clamp(this.size.height,this.lower.height,this.upper.height)

		if(!this.IsEnabled())	return this;

		//拡大率
		const oldScale	= {	x:this.entity.getScaleX(),			y:this.entity.getScaleY(),			};
		const newScale	= {	x:this.size.width/this.imgWidth,	y:this.size.height/this.imgHeight,	};

		//拡縮アニメーション
		const isFast	= !!(oldScale.x && oldScale.y && newScale.x && newScale.y);	//速度
		this.animation	= BgAnimation.None;	//種類
		if(oldScale.x < newScale.x || oldScale.y < newScale.y)	this.animation |= BgAnimation.Widen;
		if(oldScale.x > newScale.x || oldScale.y > newScale.y)	this.animation |= BgAnimation.Narrow;

		//Apply
		this.entity.stopAllActions();
		if(!this.entity.isVisible())	this.entity.setScale(0);
		else if(animates){
			this.entity.runAction(cc.sequence(
				cc.scaleTo(isFast?0.2:0.4, newScale.x,newScale.y).easing(cc.easeBackOut(10)),
				cc.callFunc(()=>{
					if(newScale.x<=0 || newScale.y<=0)	this.entity.setVisible(false);
				})
			));
		}
		else{
			this.entity.setScale(newScale.x,newScale.y);
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

	/** 実行中のアクションがあるか
	 * @returns {boolean}
	 * @memberof LabelBg
	 */
	IsRunningActions(){
		if(this.IsEnabled() && this.entity.getNumberOfRunningActions()>0) return true;
		return false;
	}
}


})();	//File Scope
