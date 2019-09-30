/* *******************************************************************************
	ページ遷移クラス群
********************************************************************************/
var cc,_;
var rc;
var Sprite,Button;

/** ページ送り機能
 * @class Pager
 */
// eslint-disable-next-line no-unused-vars
var Pager	= class Pager{

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
		this._onPageChanged		= [];
		this._onChapterChanged	= [];
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
		this.nPages			= this.GetNumPages() || 1;
		dst					= dst===null ? this.GetNumPages() : dst;

		const old			= this._page;
		this._page	= _(dst).clamp( 0, this.GetNumPages()-1 );
		if(old==this._page)	return this;	//遷移しない

		//イベントリスナ
		if(callbacks && this._onPageChanged) this._onPageChanged.forEach(f=>f());
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
		if(old==this._chapter)	return this;	//遷移しない
		this.SetPage(0,false);

		//イベントリスナ
		if(callbacks){
			if(this._onChapterChanged)	this._onChapterChanged.forEach(f=>f());
			if(this._onPageChanged)		this._onPageChanged.forEach(f=>f());
		}

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
		if(typeof callback !== "function")	this._onPageChanged = [];
		else								this._onPageChanged.push(callback);
	}
	/** チャプター変更時のコールバック関数
	 * @param {function} [callback=null]
	 */
	set onChapterChanged(callback=null){
		if(typeof callback !== "function")	this._onChapterChanged = [];
		else								this._onChapterChanged.push(callback);
	}

	GetNumPages(chapter=null){
		if(chapter===null)	return this.nPagesList[this._chapter];
		else				return this.nPagesList[chapter];
	}
	GetNumChapters(){
		return this.nPagesList.length || 1;
	}
	/** @param {number} p */
	set nPages(p){ this.nPagesList[this._chapter]=p}
	get mostPagesOfAllChapters()	{return _.max(this.nPagesList)}
}


// eslint-disable-next-line no-unused-vars
var PageNavigator	= class PageNavigator{

	constructor(scene,pager){
		this.parent	= scene;
		this.pager	= pager;

		/** @var ナビゲーション用ボタン */
		this.buttons		= null;
		/** @var ページ遷移用インジケータのコンテナ */
		this.pageIndicators	= null;
		/** @var チャプター遷移用インジケータのコンテナ */
		this.chapterIndicators	= null;

		if(pager){
			this.pager.onPageChanged	= ()=>this.SetPageIndicator();
			this.pager.onChapterChanged	= ()=>this.SetChapterIndicator();
		}
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
			.SetIndex(0).SetPosition(32,size.height-32)
			.AssignKeyboard(cc.KEY.r)	//R
			.OnButtonUp(()=>this.parent.ResetForce());

		if(!this.pager || this.pager.GetNumPages()<2)	return this;

		//矢印ボタン
		this.buttons.at("Prev")
			.SetIndex(2).SetPosition(32+32,32)
			.AssignKeyboard(cc.KEY.h, cc.KEY.left)	//H
			.OnButtonUp(()=>this.pager.AddPage(-1))
			.SetAutoOff(true)
			.sprite.SetRotate(180);
		this.buttons.at("Next")
			.SetIndex(2).SetPosition(size.width-(32+32),32)
			.AssignKeyboard(cc.KEY.l, cc.KEY.right)	//L
			.OnButtonUp(()=>this.pager.AddPage(+1))
			.SetAutoOff(true);

		this.buttons.at("First")
			.SetIndex(3).SetPosition(32,32)
			.AssignKeyboard(cc.KEY.home)	//Home
			.OnButtonUp(()=>this.pager.SetPage(0))
			.SetAutoOff(true)
			.sprite.SetRotate(180);
		this.buttons.at("Last")
			.SetIndex(3).SetPosition(size.width-32,32)
			.AssignKeyboard(cc.KEY.end)	//End
			.OnButtonUp(()=>this.pager.SetPage(null))
			.SetAutoOff(true);

		this.buttons.at("PrevChapter")
			.SetIndex(2).SetPosition(32+32,size.height-32)
			.AssignKeyboard(cc.KEY.k, cc.KEY.up)	//K
			.OnButtonUp(()=>{this.pager.AddChapter(-1)})
			.SetVisible(this.pager.nChapters>1)
			.SetAutoOff(true)
			.sprite.SetRotate(-90);
		this.buttons.at("NextChapter")
			.SetIndex(2).SetPosition(32+32,size.height-32-32*(this.pager.GetNumChapters()+1))
			.AssignKeyboard(cc.KEY.j, cc.KEY.down)	//K
			.OnButtonUp(()=>this.pager.AddChapter(+1))
			.SetVisible(this.pager.nChapters>1)
			.SetAutoOff(true)
			.sprite.SetRotate(90);


		//ページインジケータ
		if(this.pager.mostPagesOfAllChapters>1){
			this.pageIndicators	= _.range(this.pager.mostPagesOfAllChapters).map(()=>
				Sprite.CreateInstance(rc.img.navigationButton)
					.AddToLayer(layer)
					.Attr({zIndex:5})
					.SetIndex(1)
			);
			this.SetPageIndicator();
		}

		//チャプターインジケータ
		if(this.pager.GetNumChapters()>1){
			this.chapterIndicators	= _.range(this.pager.GetNumChapters()).map(()=>
				Sprite.CreateInstance(rc.img.navigationButton)
					.AddToLayer(layer)
					.Attr({zIndex:5})
					.SetIndex(1)
			);
			this.SetChapterIndicator();
		}

		return this;
	}

	/** ページインジケータ設定 */
	SetPageIndicator(){
		if(!this.pager || this.pager.GetNumPages()<2)	return this;
		const size		= cc.director.getWinSize();

		this.pageIndicators
			.forEach((indicator)=>indicator.SetVisible(false).SetScale(0.5));

		this.pageIndicators
			.filter((v,i)=> i < this.pager.GetNumPages() )
			.forEach((indicator,i)=>{
				const indicatorWidth	= this.pager.GetNumPages()<8 ? 128 : 256;
				indicator.SetVisible(true).SetPosition( (size.width-indicatorWidth)/2 + i*(indicatorWidth/(this.pager.GetNumPages()-1)), 32);
				if(i==this.pager.GetPage())	indicator.SetColor("#FFA000").SetScale(0.75).StopActions().RunActions( [cc.scaleTo(0.20, 0.5),cc.fadeTo (0.25,255),[null,cc.rotateBy(4,360)] ]);
				else						indicator.SetColor("#FFFFFF").SetRotate(0).StopActions().RunActions( [cc.scaleTo(0.25, 0.25 ),cc.fadeTo (0.25,96)] );
			});
		return this;
	}

	/** チャプターインジケータ設定 */
	SetChapterIndicator(){
		if(this.pager.GetNumChapters()<2)	return this;
		const size		= cc.director.getWinSize();

		this.chapterIndicators
			.forEach((indicator,i)=>{
				indicator.SetVisible(true).SetPosition(32+32,size.height-32-32*(i+1));
				if(i==this.pager.GetChapter())	indicator.SetColor("#FFA000").StopActions().RunActions( cc.fadeTo (0.25,255));
				else							indicator.SetColor("#FFFFFF").StopActions().RunActions( cc.fadeTo (0.25,96) );
			});
		return this;
	}

	Update(dt){
		if(this.buttons)	this.buttons.Update(dt);
		return this;
	}

}

