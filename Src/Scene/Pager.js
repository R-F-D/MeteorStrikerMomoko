/* *******************************************************************************
	シーン基本クラス
********************************************************************************/
var Scene	= Scene || {};
var cc;
(function(){	//File Scope


/** ページ送り機能
 * @class Pager
 */
Scene.Pager	= class Pager{

	/** Creates an instance of Pager.
	 * @param {number} nPages			ページ数
	 * @param {number} [nChapters=1]	チャプター数
	 * @memberof Pager
	 */
	constructor(nPages,nChapters=1){
		this.nPages			= Number(nPages) || 1;
		this.nChapters		= Number(nChapters) || 1;
		this._page			= 0;
		this._chapter		= 0;
		this.onPageChanged	= null;
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

		if(callbacks && old!=this._page && this.onPageChanged) this.onPageChanged();
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

		if(callbacks && old!=this._chapter && this.onPageChanged) this.onPageChanged();
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
}

})();	//File Scope