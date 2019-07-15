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
		const size		= cc.director.getWinSize();
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

				if(_this._naviButtonIsEnabled){
					const nButtons	= _this.pager ? 5 : 1;
					_this.naviButtons	= Button.CreateInstance(nButtons).AddToLayer(this).SetTags("Reset","First","Prev","Next","Last");
					_this.naviButtons.forEach(b=>b.CreateSprite(rc.img.navigationButton).SetVisible(true).SetColorOnHover([0xFF,0xA0,0x00]));

					_this.naviButtons.at("Reset")
						.SetIndex(0).SetPosition(16,size.height-16)
						.AssignKeyboard(cc.KEY.r)	//R
						.OnButtonUp(()=>_this.ResetForce());

					if(_this.pager){
						_this.naviButtons.at("Prev")
							.SetIndex(2).SetPosition(16+32+8,32)
							.AssignKeyboard(cc.KEY.h, cc.KEY.left)	//H
							.OnButtonUp(()=>_this.pager.Add(-1))
							.sprite.SetRotate(180);
						_this.naviButtons.at("Next")
							.SetIndex(2).SetPosition(size.width-16-32-8,32)
							.AssignKeyboard(cc.KEY.l, cc.KEY.right)	//L
							.OnButtonUp(()=>_this.pager.Add(+1));
						_this.naviButtons.at("First")
							.SetIndex(3).SetPosition(16,32)
							.AssignKeyboard(cc.KEY.home)	//Home
							.OnButtonUp(()=>_this.pager.Set(0))
							.sprite.SetRotate(180);
						_this.naviButtons.at("Last")
							.SetIndex(3).SetPosition(size.width-16,32)
							.AssignKeyboard(cc.KEY.end)	//End
							.OnButtonUp(()=>_this.pager.Set(null));
					}
				}

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
	 * @param {number} [nPages=0] ページ枚数。0のときページ送りなし。
	 * @returns this
	 */
	EnableNaviButtons(nPages=0){
		this._naviButtonIsEnabled	= true;
		if(nPages>0)	this.pager	= new Pager(nPages);
		return this;
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

		Achievement.Init();
	}

}//class

Scene.SceneBase.first		= null;
Scene.SceneBase.resetTo		= null;
Scene.SceneBase._date		= null;
Scene.SceneBase._initsFirst	= false;



class Pager{
	constructor(nPages){
		this.nPages		= nPages;
		this._current	= 0;
		this.onPaged	= null;
	}

	Get(){
		return this._current || 0;
	}

	Set(dst, callbacks=true){
		this.nPages		= this.nPages || 1;
		dst				= dst===null ? this.nPages : dst;

		const old		= this._current;
		this._current	= _(dst).clamp( 0, this.nPages-1 );

		if(callbacks && old!=this._current && this.onPaged) this.onPaged();
		return this;
	}

	Add(value, callbacks=true){
		return this.Set(this._current+value,callbacks);
	}

}

})();	//File Scope

