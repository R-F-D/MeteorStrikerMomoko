/* *******************************************************************************
	シーン基本クラス
********************************************************************************/
var Scene	= Scene || {};
var cc;
(function(){	//File Scope


/** シーン基本クラス */
Scene.SceneBase	= class {

	static first	= null;
	static resetTo	= null;

	constructor(){

		/** @var number シーン内のシークエンス */
		this.sequence			= null;
		/** @var {boolean} シークエンス遷移が可能か */
		this.isSequenceMovable	= false;
		/** @var シーン開始からのカウント */
		this.count				= 0;

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
		/** @var イベントリスナのコンテナ*/
		this.listeners	= {};
		/** @var シーン共通イベントリスナ*/
		this.commonEventListeners	= [];
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
		this.sequence.Init();
		this.ApplyCommonEventListeners();

		return this;
	}

	/** シークエンス初期化
	 * @param {*} initialSeq シークエンス初期値
	 * @param {*} seqContainer シークエンスのコンテナ
	 * @param {*} layerInstance イベントリスナの対象レイヤ
	 * @returns
	 */
	InitSequence(initialSeq,seqContainer,layerInstance){
		this.sequence	= initialSeq;
		for(let i in seqContainer){
			seqContainer[i].SetListenerTarget(layerInstance);
		}
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
		const _this	= this;
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
		
		this.ccSceneInstance	= new (cc.Scene.extend({
			onEnter	: function (){
				this._super();
				childScene.SetLayer("SceneBase.TouchFx", childScene.ccLayers.touchFx,0x0100);
				childScene.OnEnter();
				this.scheduleUpdate();
			},
			update	: function(dt){
				this._super();
				childScene.OnUpdating(dt);
				if(childScene.sequence instanceof Scene.Sequence)	childScene.sequence.Update(dt);
				childScene.OnUpdated(dt);
			},	
		}))();
		return this;
	}

	/** シーン遷移
	 * @param {*} newSceneClass シーンクラスの型
	 * @returns  this
	 */
	ReplaceScene(newSceneClass){
		cc.director.runScene( cc.TransitionFade.create(1,newSceneClass.Create().GetCcSceneInstance()));
		return this;
	}

	OnEnter(){return this}
	SetSequenceFunctions(){return this;}

	SetCommonEventListeners(listeners){
		if(!Array.isArray(listeners))	listeners	= [listeners];
		this.commonEventListeners	= listeners;
		return this;
	}
	PushCommonEventListeners(listeners){
		if(!Array.isArray(listeners))	listeners	= [listeners];
		this.commonEventListeners.push(...listenrs);
		return this;
	}
	
	ApplyCommonEventListeners(layer=null){
		//イベントリスナ初期化＆設定
		layer	= layer||this.eventLayer;
		if(!layer)	return this;
		
		this.eventLayer	= layer;
		//cc.eventManager.removeListeners(layer);
		//共通イベント
		for(let e of this.commonEventListeners){
			if(e instanceof cc.EventListener)	cc.eventManager.addListener(e,layer);
		}
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

}//class

})();	//File Scope

