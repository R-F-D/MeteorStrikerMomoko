/* *******************************************************************************
	選択肢クラス
********************************************************************************/
var cc;

class Selector{

	constructor(nItems){
		this.buttons		= Button.CreateInstance(nItems);
		this.layer			= null;
		/** @var 選択されたボタン番号 */
		this.idxSelected	= null;

		this.area	= {x:0,y:0,width:0,height:0};
		this.gap	= 16;

		/** @var {function} f(key,tag)*/
		this.OnSelected		= (key,tag)=>{};
	}

	Init(){
		this.buttons.forEach((button,i)=>{
			button
				.CreateSprite(rc.img.labelButton)
				.CreateLabel(20)
				.SetColorOnHover([0xFF,0xA0,0x00])
				.SetLabelColor("#FF0000")
				.SetScale(0.5)
				.OnTouchEnded(()=>this.Select(i));
		});
		return this;
	}

	AddToLayer(layer){
		this.layer	= layer;
		this.buttons.AddToLayer(layer);
		return this;
	}

	/** 選択肢エリアの範囲を設定
	 * @param {number} left				x座標
	 * @param {number} top				y座標
	 * @param {number} [width=null]		横幅。省略(null)時は画面いっぱいまで。
	 * @param {number} [height=null]	縦幅。省略(null)時は画面いっぱいまで。
	 * @returns {this}
	 * @memberof Selector
	 */
	SetArea(left,top,width=null,height=null){
		//代入 width/heightはnull時に画面端までの値を算出
		this.area.x			= Math.trunc(left);
		this.area.y			= Math.trunc(top);
		this.area.width		= width !==null	? Math.trunc(width) : cc.director.getWinSize().width -this.area.x;
		this.area.height	= height!==null	? Math.trunc(height): Math.trunc(top);
		if(this.area.width<=0 || this.area.height<=0)	return this;

		let x	= this.area.x;	//左上座標（アンカーポイント修正込み）
		let y	= this.area.y;	//
		let dx	= 0;			//差分
		let dy	= 0;			//

		this.buttons.forEach((button,i)=>{
			const box	= button.sprite.entity.getBoundingBox();
			const anchor= button.sprite.entity.getAnchorPoint();

			//選択肢1つ分だけ座標をずらす
			if(i>0){
				dx	+= box.width + this.gap;
				if(this.area.width-box.width < dx){
					dx	= 0;
					dy	+= box.height + this.gap;
				}
			}

			button.SetPosition(	x + dx + Math.trunc(box.width * anchor.x),
								y - dy - Math.trunc(box.height* (1-anchor.y))	);
		});
		return this;
	}


	Update(dt){
		this.buttons.Update(dt);
		return this;
	}

	/** 選択肢をセレクトする
	 * @param {number} idx
	 * @returns
	 * @memberof Selector
	 */
	Select(idx){
		if(this.idxSelected	== idx)	return this;
		this.idxSelected	= idx;

		const button	= this.buttons.at(idx);
		this
			.Turn(button,true)
			.TurnOffAll(this.idxSelected)
			.OnSelected(i,button.tag);
		return this;
	}

	/** 特定ボタンのオン/オフを設定する
	 * @param {ButtonItem} button	対象のボタン
	 * @param {boolean} switchesOn	ONなら真、OFFなら偽
	 * @returns
	 * @memberof Selector
	 */
	Turn(button,switchesOn){
		if(!button)	return this;
		if(switchesOn){
			button.SetColor([0xFF,0xA0,0x00]);
		}
		else{
			button.SetColor([0xFF,0xFF,0xFF]);
		}
		return this;
	}


	/** 全てのスイッチをオフにする
	 * @param {array|number} [excludingIndexes=null]	除外するインデックス。null時は除外なし。
	 * @returns
	 * @memberof Selector
	 */
	TurnOffAll(excludingIndexes=null){
		this.buttons
			.filter((b,i)=>{	//除外
				if		(excludingIndexes===null || excludingIndexes===[])	return true;
				else if	(Array.isArray(excludingIndexes))					return !excludingIndexes.includes(i);
				else														return excludingIndexes!=i;
			})
			.forEach(b=>{
				this.Turn(b,false);
			})
		return this;
	}

	/** 選択されているボタン
	 * @readonly
	 * @memberof Selector
	 */
	get selectedButton(){
		if(this.idxSelected===null)	return null;
		return this.buttons.at(this.idxSelected) || null;
	}

}


