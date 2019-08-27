/* *******************************************************************************
	ページ遷移クラス群
********************************************************************************/

/** ページ送り機能
 * @class Pager
 */
class Pager{

	/** Creates an instance of Pager.
	 * @param {number} nPagesList		ページ数
	 * @memberof Pager
	 */
	constructor(...nPagesList){
		if(nPagesList.length<=0)	nPagesList = [1];
		this.nPagesList		= nPagesList;
		this.nChapters		= nPagesList.length;

		this._page			= 0;
		this._chapter		= 0;
		this._onPageChanged	= [];
	}

	/** 現在のページを取得
	 * @returns {number}
	 * @memberof Pager
	 */
	GetPage(){
		return this._page || 0;
	}

	/** 現在のチャプターを取得
	 * @returns {number}
	 * @memberof Pager
	 */
	GetChapter(){
		return this._chapter || 0;
	}

	/** ページ番号の絶対指定
	 * @param {number}} dst					ページ番号
	 * @param {boolean} [callbacks=true]	ページ変更時にコールバック関数を呼ぶか
	 * @returns {this}
	 * @memberof Pager
	 */
	SetPage(dst, callbacks=true){
		this.nPages			= this.nPages || 1;
		dst					= dst===null ? this.nPages : dst;

		const old			= this._page;
		this._page	= _(dst).clamp( 0, this.nPages-1 );

		if(callbacks && old!=this._page && this._onPageChanged) this._onPageChanged.forEach(f=>f());
		return this;
	}

	/** チャプター番号の絶対指定
	 * @param {number}} dst					チャプター番号
	 * @param {boolean} [callbacks=true]	チャプター変更時にコールバック関数を呼ぶか
	 * @returns {this}
	 * @memberof Pager
	 */
	SetChapter(dst, callbacks=true){
		this.nChapters		= this.nChapters || 1;
		dst					= dst===null ? this.nChapters : dst;

		const old		= this._chapter;
		this._chapter	= _(dst).clamp( 0, this.nChapters-1 );

		if(callbacks && old!=this._chapter && this._onPageChanged) this._onPageChanged.forEach(f=>f());
		return this;
	}

	/** ページ番号の相対指定
	 * @param {number} value				ページ番号の増分
	 * @param {boolean} [callbacks=true]	ページ変更時にコールバック関数を呼ぶか
	 * @returns {this}
	 * @memberof Pager
	 */
	AddPage(value, callbacks=true){
		return this.SetPage(this._page+value,callbacks);
	}

	/** チャプター番号の相対指定
	 * @param {number} value				チャプター番号の増分
	 * @param {boolean} [callbacks=true]	チャプター変更時にコールバック関数を呼ぶか
	 * @returns {this}
	 * @memberof Pager
	 */
	AddChapter(value, callbacks=true){
		return this.SetChapter(this._chapter+value,callbacks);
	}

	/** ページ変更時のコールバック関数
	 * @param {function} [callback=null]
	 */
	set onPageChanged(callback=null){
		if(typeof callback !== "function")	callback = [];
		else								this._onPageChanged.push(callback);
	}

	get nPages(){ return this.nPagesList[this._chapter]};
	set nPages(p){ this.nPagesList[this._chapter]=p};
}


class PageNavigator{

	constructor(scene,pager){
		this.parent	= scene;
		this.pager	= pager;

		/** @var ナビゲーション用ボタン */
		this.buttons		= null;
		/** @var ページ遷移用インジケータのコンテナ */
		this.pageIndicator	= null;

		if(pager)	this.pager.onPageChanged	= ()=>this.SetPageIndicator();
	}

	//ナビボタン作成
	CreateButtons(layer){
		if(!layer)	return this;

		const size		= cc.director.getWinSize();
		const nButtons	= this.pager ? 7 : 1;

		this.buttons	= Button.CreateInstance(nButtons).AddToLayer(layer).SetTags("Reset","First","Prev","Next","Last","PrevChapter","NextChapter");
		this.buttons.forEach(b=>{
			b.CreateSprite(rc.img.navigationButton).SetVisible(true).SetColorOnHover([0xFF,0xA0,0x00])
		});

		//リセットボタン
		this.buttons.at("Reset")
			.SetIndex(0).SetPosition(24,size.height-24)
			.AssignKeyboard(cc.KEY.r)	//R
			.OnButtonUp(()=>this.parent.ResetForce());

		if(!this.pager || this.pager.nPages<2)	return this;

		//矢印ボタン
		this.buttons.at("Prev")
			.SetIndex(2).SetPosition(24+32+12,32)
			.AssignKeyboard(cc.KEY.h, cc.KEY.left)	//H
			.OnButtonUp(()=>this.pager.AddPage(-1))
			.SetAutoOff(true)
			.sprite.SetRotate(180);
		this.buttons.at("Next")
			.SetIndex(2).SetPosition(size.width-24-32-12,32)
			.AssignKeyboard(cc.KEY.l, cc.KEY.right)	//L
			.OnButtonUp(()=>this.pager.AddPage(+1))
			.SetAutoOff(true);

		this.buttons.at("First")
			.SetIndex(3).SetPosition(24+4,32)
			.AssignKeyboard(cc.KEY.home)	//Home
			.OnButtonUp(()=>this.pager.SetPage(0))
			.SetAutoOff(true)
			.sprite.SetRotate(180);
		this.buttons.at("Last")
			.SetIndex(3).SetPosition(size.width-24-4,32)
			.AssignKeyboard(cc.KEY.end)	//End
			.OnButtonUp(()=>this.pager.SetPage(null))
			.SetAutoOff(true);

		this.buttons.at("PrevChapter")
			.SetIndex(2).SetPosition(24+32+12,168+72)
			.AssignKeyboard(cc.KEY.k, cc.KEY.up)	//K
			.OnButtonUp(()=>this.pager.AddChapter(-1))
			.SetVisible(this.pager.nChapters>1)
			.SetAutoOff(true)
			.sprite.SetRotate(-90);
		this.buttons.at("NextChapter")
			.SetIndex(2).SetPosition(24+32+12,168-72)
			.AssignKeyboard(cc.KEY.j, cc.KEY.down)	//K
			.OnButtonUp(()=>this.pager.AddChapter(+1))
			.SetVisible(this.pager.nChapters>1)
			.SetAutoOff(true)
			.sprite.SetRotate(90);


		//インジケータ
		if(this.pager.nPages<2) return this;
		const indicatorWidth	= this.pager.nPages<8 ? 128 : 256;
		this.pageIndicator	= _.range(this.pager.nPages).map((v,i)=>
			Sprite.CreateInstance(rc.img.navigationButton).AddToLayer(layer).Attr({zIndex:5})
				.SetIndex(1)
				.SetPosition( (size.width-indicatorWidth)/2 + i*(indicatorWidth/(this.pager.nPages-1)), 32)
		);
		this.SetPageIndicator();

		return this;
	}

	/** ページインジケータ設定 */
	SetPageIndicator(){
		if(!this.pager || this.pager.nPages<2)	return this;

		this.pageIndicator.forEach((indicator,i)=>{
			if(i==this.pager.GetPage())	indicator.SetColor("#FFA000").SetScale(1).StopActions().RunActions( [cc.scaleTo(0.25, 0.75),cc.fadeTo (0.25,255),[null,cc.rotateBy(4,360)] ]);
			else						indicator.SetColor("#FFFFFF").SetRotate(0).StopActions().RunActions( [cc.scaleTo(0.25, 0.5 ),cc.fadeTo (0.25,96)] );
		});
		return this;
	}

	Update(dt){
		if(this.buttons)	this.buttons.Update(dt);
		return this;
	}

}

