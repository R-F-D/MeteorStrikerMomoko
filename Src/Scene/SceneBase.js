/* *******************************************************************************
	シーン基本クラス
********************************************************************************/
var Scene	= Scene || {};
var cc;
(function(){	//File Scope


/** シーン基本クラス */
Scene.SceneBase	= class {

	constructor(){

		/** @var number シーン内のシークエンス */
		this.sequence			= null;
		/** @var {boolean} シークエンス遷移が可能か */
		this.isSequenceMovable	= false;
		/** @var シーン開始からのカウント */
		this.count				= 0;
		/** @var ポーズ用カウント */
		this.pauseCount			= 0;
		/** @var ページ機能 */
		this.pager				= null;

		/** @var cc.Layer cc.Sceneインスタンス */
		this.ccSceneInstance	= null;
		/** @var cc.Layerに渡すためのレイヤコンテナ*/
		this.ccLayers	= {};
		/** @var cc.Layerインスタンスのコンテナ */
		this.ccLayerInstances	= {};

		/** @var Spriteクラスのコンテナ*/
		this.sprites	= {};
		/** @var Labelクラスのコンテナ*/
		this.labels		= {};
		/** @var ナビゲーション用ボタンナ */
		this.naviButtons	= null;
		/** @var ページ遷移用インジケータのコンテナ */
		this.pageIndicator	= null;
		/** @var イベントリスナのコンテナ*/
		this.listeners	= {};
		/** @var シーン共通イベントリスナ*/
		this.commonEventListeners	= {};
		this.commonEventListeners["SceneBase.TouchFx"]	= [];

		Scene.SceneBase.OnEnterFirst();
	}

	/** シーンの更新処理 共通部分
	 * @param {*} dt
	 */
	OnUpdating(dt){return this;}
	/** シーンの更新処理 共通部分
	 * @param {*} dt
	 */
	OnUpdated(dt){
		++this.count;
		return this;
	}

	/** Create Instance */
	static Create(){return new this();}
	/** Get cc.Scene Instance */
	GetCcSceneInstance(){return this.ccSceneInstance;	}

	/** レイヤ内容の変更
	 * @param {*} layerTag		変更されるレイヤのタグ
	 * @param {*} layerInst 	変更するレイヤのインスタンス
	 * @param {Number} zOrder	Zオーダー
	 */
	SetLayer(layerTag,layerInst,zOrder=0){
		if(!layerInst)	return null;

		if(this.ccLayerInstances[layerTag]){
			this.ccLayerInstances[layerTag].unscheduleUpdate();
			this.ccSceneInstance.removeChildByTag(layerTag);
		}
		this.ccLayerInstances[layerTag]	= new layerInst();
		this.ccSceneInstance.addChild(this.ccLayerInstances[layerTag], zOrder, layerTag	);

		return this;
	}


	/** シークエンスの変更
	 * @param {*} nextSeq 次のシークエンス
	 * @param {boolean} [isForce=false] 同一シークエンスの場合でも強制的に変更する
	 * @returns this
	 */
	SetSequence(nextSeq,isForce=true){
		if(!isForce && this.sequence===nextSeq)	return this;
		this.sequence	= nextSeq;

		//レイヤのイベント削除
		this.ccSceneInstance.getChildren()
			.filter(child=>child instanceof cc.Layer)
			.forEach(layer=>cc.eventManager.removeListeners(layer));

		this.sequence.Init();
		this.ApplyCommonEventListeners("SceneBase.TouchFx",this.ccLayerInstances["SceneBase.TouchFx"]);

		return this;
	}

	/** シークエンス初期化
	 * @param {*} seqContainer シークエンスのコンテナ
	 * @param {*} layerInstance イベントリスナの対象レイヤ
	 * @returns
	 */
	InitSequences(seqContainer,eventTag,layerInstance){
		_.forEach(seqContainer,seq=>seq.SetListenerTarget(eventTag,layerInstance));
		return this;
	}

	/** レイヤに背景色を設定
	 * @param {*} layer
	 * @param {*} color
	 * @returns this
	 */
	SetBackgroundColor(layer,color){
		const size	= cc.director.getWinSize();
		layer.addChild(new cc.LayerColor(typeof color==='string'?cc.color(color):color, size.width,size.height));
		return this;
	}

	/** レイヤ一覧初期化
	 * @returns this
	 */
	InitLayerList(){
		const _this		= this;
		this.ccLayers	= {};
		this.AddToLayerList("touchFx",{
			ctor:function(){
				this._super();
				this.scheduleUpdate();
				_this.fx			= _this.fx||{};
				_this.fx.touched	= Effect.Touched.Create().Init(this);
				return true;
			},
			update	: function(dt){
				this._super();
				_this.fx.touched.Update();
			},
		});
		this.AddToLayerList("achievement",{
			ctor:function(){
				this._super();
				this.scheduleUpdate();
				return true;
			},
			update	: function(dt){
				this._super();
				Scene.SceneBase._date = null;
				Achievement.Update(dt);
			},
		});
		this.AddToLayerList("ui",{
			ctor:function(){
				this._super();
				this.scheduleUpdate();
				if(_this._naviButtonIsEnabled)	_this.CreateNaviButtons(this);
				return _this.OnUiLayerCreate(this);
			},
			update	: function(dt){
				this._super();
				if(_this.naviButtons)	_this.naviButtons.Update(dt);
				_this.sequence.Update(dt,"layer-ui");
			},
		});
		return this;
	}
	/** レイヤ一覧にレイヤ追加
	 * @param {string} key レイヤ一覧のキー
	 * @param {object} layerProperties 追加するcc.Layerのプロパティ
	 * @returns this
	 */
	AddToLayerList(key,layerProperties){
		if(this.ccLayers==null) this.ccLayers = {};
		this.ccLayers[key]	= cc.Layer.extend(layerProperties);
		return this;
	}

	/** イベントリスナ一覧初期化
	 * @returns this
	 */
	InitEventListenerList(){
		this.listeners	= {};
		this.AddPropertiesToEventListenerList("touched",{
			event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
			onTouchesBegan	: (touches,event)=>{
				for(let t of touches){
					const pos	= t.getLocation();
					this.fx.touched.Spawn(pos.x,pos.y);
				}
				return true;
			},
		})
		//キーボードリセット
		.AddPropertiesToEventListenerList("keyboardReset",{
			event			: cc.EventListener.KEYBOARD || null,
			onKeyReleased	: (code,event)=>{
				if(code==cc.KEY.escape){
					this.ResetForce();
				}
			},
		});
		return this;
	}

	/** イベントリスナ一覧にイベントリスナ追加（生イベントリスナ）
	 * @param {*} key
	 * @param {*} rawEventListener イベントリスナ
	 * @returns this
	 */
	AddToEventListenerList(key,rawEventListener){
		if(this.listeners==null) this.listeners = {};
		this.listeners[key]	= rawEventListener
		return this;
	}

	/** イベントリスナ一覧にイベントリスナ追加（プロパティで追加）
	 * @param {*} key イベントリスナ一覧のキー
	 * @param {*} listenerProperties 追加するcc.EventListenerのプロパティ
	 * @returns this
	 */
	AddPropertiesToEventListenerList(key,listenerProperties){
		if(this.listeners==null) this.listeners = {};
		if(listenerProperties.event)	this.listeners[key]	= cc.EventListener.create(listenerProperties);
		return this;
	}

	ApplicateCcSceneInstance(childScene){
		if(!childScene instanceof Scene.SceneBase) throw new Error("Arg 'childScene' is not the child class of SceneBase.");

		const _this	= this;
		this.ccSceneInstance	= new (cc.Scene.extend({
			onEnter	: function (){
				this._super();
				childScene
					.SetLayer("SceneBase.TouchFx",    childScene.ccLayers.touchFx,    0x0202)
					.SetLayer("SceneBase.Achievement",childScene.ccLayers.achievement,0x0201)
					.SetLayer("SceneBase.Ui",         childScene.ccLayers.ui,         0x0200)
					.OnEnter();
				Achievement.SetLayer(_this.ccLayerInstances["SceneBase.Achievement"]);
				this.scheduleUpdate();
			},
			update	: function(dt){
				this._super();
				if(_this.pauseCount > 0)	{
					--_this.pauseCount;
					return;
				}
				childScene.OnUpdating(dt);
				if(childScene.sequence instanceof Scene.Sequence)	childScene.sequence.Update(dt);
				childScene.OnUpdated(dt);
			},
		}))();
		return this;
	}

	/** シーン遷移
	 * @param {*} newSceneClass シーンクラスの型
	 * @returns {Scene.SceneBase} 新シーンクラスのインスタンス
	 */
	ReplaceScene(newSceneClass){
		const sceneInst	= newSceneClass.Create();
		cc.director.runScene( cc.TransitionFade.create(1,sceneInst.GetCcSceneInstance()));
		return sceneInst;
	}

	OnEnter(){return this}
	OnUiLayerCreate(layer){return true};
	SetSequenceFunctions(){return this;}

	SetCommonEventListeners(tag,listeners){
		if(!Array.isArray(listeners))	listeners	= [listeners];
		this.commonEventListeners[tag]	= listeners;
		return this;
	}
	PushCommonEventListeners(tag,listeners){
		if(!Array.isArray(listeners))	listeners	= [listeners];
		this.commonEventListeners[tag].push(...listenrs);
		return this;
	}

	/**共通イベントリスナの設定*/
	ApplyCommonEventListeners(tag,layer){
		if(!layer||!tag)	return this;

		(this.commonEventListeners[tag]||[])
			.filter(e=>e instanceof cc.EventListener)
			.forEach(e=>cc.eventManager.addListener(_.cloneDeep(e),layer));
		return this;
	}

	/** ナビゲーションボタンを有効にする
	 * @param {number} [nPages]		ページ枚数。1以下のときページ送りなし。
	 * @param {number} [nChapters]	チャプター数。ページ送りなしの場合は無効。
	 * @returns this
	 */
	EnableNaviButtons(nPages,nChapters=1){
		this._naviButtonIsEnabled	= true;
		if(nPages>1)	this.pager	= new Pager(nPages,nChapters);
		return this;
	}

	//ナビボタン作成
	CreateNaviButtons(layer){
		if(!layer || !this._naviButtonIsEnabled)	return this;

		const size		= cc.director.getWinSize();
		const nButtons	= this.pager ? 7 : 1;
		this.naviButtons	= Button.CreateInstance(nButtons).AddToLayer(layer).SetTags("Reset","First","Prev","Next","Last","PrevChapter","NextChapter");
		this.naviButtons.forEach(b=>b.CreateSprite(rc.img.navigationButton).SetVisible(true).SetColorOnHover([0xFF,0xA0,0x00]));

		//リセットボタン
		this.naviButtons.at("Reset")
			.SetIndex(0).SetPosition(16,size.height-16)
			.AssignKeyboard(cc.KEY.r)	//R
			.OnButtonUp(()=>this.ResetForce());

		if(!this.pager)	return this;

		//矢印ボタン
		this.naviButtons.at("Prev")
			.SetIndex(2).SetPosition(16+32+12,32)
			.AssignKeyboard(cc.KEY.h, cc.KEY.left)	//H
			.OnButtonUp(()=>this.pager.AddPage(-1))
			.sprite.SetRotate(180);
		this.naviButtons.at("Next")
			.SetIndex(2).SetPosition(size.width-16-32-12,32)
			.AssignKeyboard(cc.KEY.l, cc.KEY.right)	//L
			.OnButtonUp(()=>this.pager.AddPage(+1));

		this.naviButtons.at("First")
			.SetIndex(3).SetPosition(16+4,32)
			.AssignKeyboard(cc.KEY.home)	//Home
			.OnButtonUp(()=>this.pager.SetPage(0))
			.sprite.SetRotate(180);
		this.naviButtons.at("Last")
			.SetIndex(3).SetPosition(size.width-16-4,32)
			.AssignKeyboard(cc.KEY.end)	//End
			.OnButtonUp(()=>this.pager.SetPage(null));

		this.naviButtons.at("PrevChapter")
			.SetIndex(2).SetPosition(16+32+12,168+72)
			.AssignKeyboard(cc.KEY.k, cc.KEY.up)	//K
			.OnButtonUp(()=>this.pager.AddChapter(-1))
			.SetVisible(this.pager.nChapters>1)
			.sprite.SetRotate(-90);
		this.naviButtons.at("NextChapter")
			.SetIndex(2).SetPosition(16+32+12,168-72)
			.AssignKeyboard(cc.KEY.j, cc.KEY.down)	//K
			.OnButtonUp(()=>this.pager.AddChapter(+1))
			.SetVisible(this.pager.nChapters>1)
			.sprite.SetRotate(90);

		//インジケータ
		const indicatorWidth	= 128;
		this.pageIndicator	= _.range(this.pager.nPages).map((v,i)=>
			Sprite.CreateInstance(rc.img.navigationButton).AddToLayer(layer).Attr({zIndex:5})
				.SetIndex(1)
				.SetPosition( (size.width-indicatorWidth)/2 + i*(indicatorWidth/(this.pager.nPages-1)), 32)
		);
		this.SetPageIndicator();
		this.pager.onPageChanged	= this.pageTransitioner;

		return this;
	}

	/** ページインジケータ設定 */
	SetPageIndicator(){
		if(!this._naviButtonIsEnabled || !this.pager)	return this;
		this.pageIndicator.forEach((indicator,i)=>{
			if(i==this.pager.GetPage())	indicator.SetColor("#FFA000").SetScale(1).RunActions([cc.scaleTo(0.25, 0.75),cc.fadeTo (0.25,255)]);
			else						indicator.SetColor("#FFFFFF").RunActions([cc.scaleTo(0.25, 0.5 ),cc.fadeTo (0.25,96 )]);
		});
		return this;
	}

	/** ページ遷移関数 */
	get pageTransitioner(){
		return ()=>this.SetPageIndicator();
	}

	/** 強制リセット
	 * @returns this
	 */
	ResetForce(){
		Debug(()=>Log("[DEBUG] Reset Scene ----------"));
		this.ReplaceScene(Scene.SceneBase.resetTo);
		return this;
	}


	/** 現在時刻のDateオブジェクトを取得
	 * @static
	 * @returns {Date} 現在時刻
	 */
	static GetDate(){
		if(Scene.SceneBase._date==null)	Scene.SceneBase._date	= new Date();
		return Scene.SceneBase._date;
	}

	/** ゲーム開始後、最初のシーン開始時に一度だけ行われる初期化処理
	 * @static
	 */
	static OnEnterFirst(){
		if(Scene.SceneBase._initsFirst)	return;
		Scene.SceneBase._initsFirst = true;

		Store.DynamicInsert(Store.Handles.Action.NumBootings);
		Achievement.Init();
	}

}//class

Scene.SceneBase.first		= null;
Scene.SceneBase.resetTo		= null;
Scene.SceneBase._date		= null;
Scene.SceneBase._initsFirst	= false;


//--------------------------------------------------------------------------------

/** ページ送り機能
 * @class Pager
 */
class Pager{

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

