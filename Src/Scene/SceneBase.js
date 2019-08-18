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
		this.pageNavigator		= null;

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
				if(_this._naviButtonIsEnabled){
					_this.pageNavigator	= new Scene.PageNavigator(_this,_this.pager);
					_this.pageNavigator.CreateButtons(this);
				}
				return _this.OnUiLayerCreate(this);
			},
			update	: function(dt){
				this._super();
				if(_this.pageNavigator)	_this.pageNavigator.Update(dt);
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
				cc.audioEngine.stopMusic();
				childScene
					.SetLayer("SceneBase.TouchFx",    childScene.ccLayers.touchFx,    0x0202)
					.SetLayer("SceneBase.Achievement",childScene.ccLayers.achievement,0x0201)
					.SetLayer("SceneBase.Ui",         childScene.ccLayers.ui,         0x0200)
					.OnEnter();
				Achievement.SetLayer(_this.ccLayerInstances["SceneBase.Achievement"]);
				Scene.SceneBase.SaveTotalRunTime(true);
				this.scheduleUpdate();
			},
			update	: function(dt){
				this._super();
				if(_this.pauseCount > 0)	{
					--_this.pauseCount;
					return;
				}
				Scene.SceneBase.SaveTotalRunTime();
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


	/** UIパーツ初期化
	 * @returns
	 */
	InitUIs(){return this;}

	/** ナビゲーションボタンを有効にする
	 * @param {number} [nPages]		ページ枚数。1以下のときページ送りなし。
	 * @param {number} [nChapters]	チャプター数。ページ送りなしの場合は無効。
	 * @returns this
	 */
	EnableNaviButtons(nPages,nChapters=1){
		this._naviButtonIsEnabled	= true;
		if(nPages>=2)	this.pager	= new Scene.Pager(nPages,nChapters);
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

	static SaveTotalRunTime(isForce=false){
		if(!isForce && Math.max(0,--Scene.SceneBase._countUntilSaveRunTime) > 0)	return;

		const now	= Scene.SceneBase.GetDate().getTime();
		if(!Scene.SceneBase._startAt || Scene.SceneBase._startAt.getTime()<= 0)	Scene.SceneBase._startAt	= now;

		const runSec	= Math.trunc((now-Scene.SceneBase._startAt.getTime())/1000);
		Store.Insert(Store.Handles.Action.RunTime, runSec, null);
		Scene.SceneBase._countUntilSaveRunTime	= (7+NormalRandom(2))*60;

		if(isForce){	//プレイ時間実績（強制更新時のみ）
			const totalSec		= Number(Store.Select(Store.Handles.Action.TotalRunTime),0) + runSec;
			Achievement.Unlock(Achievements.Action.PlayTime,totalSec);
		}
		return;
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

		//起動時刻
		Scene.SceneBase._startAt	= new Date();
		Store.Insert(	Store.Handles.Action.FirstStartAt,	Scene.SceneBase._startAt.getTime(),		Store.Conds.CurrentValueIsEmptr	);

		//起動時刻（月９）実績
		if(Scene.SceneBase._startAt.getDay()==1 || [9,19,29].includes(Scene.SceneBase._startAt.getDate()) || [9,19,21].includes(Scene.SceneBase._startAt.getHours())){
			Achievement.Unlock(Achievements.Action.Monday9,1);
		}

		//起動日数実績
		Store.Insert(	Store.Handles.Action.LastStartDay,	Scene.SceneBase._startAt.ToEpochDay(),	Store.Conds.NewValueIsGreater,	(key,value)=>{
							const nDays	= Store.DynamicInsert(Store.Handles.Action.NumBootingDays);
							Achievement.Unlock(Achievements.Action.BootDays,nDays);
						});

		//実行時間
		const lastRunTime	= Number(Store.Select(Store.Handles.Action.RunTime,0));
		if(lastRunTime){
			Store.DynamicInsert(Store.Handles.Action.TotalRunTime,	(value)=>Number(value)+lastRunTime	);
			Store.Insert(Store.Handles.Action.RunTime,0,null);
		}
	}

}//class

Scene.SceneBase.first		= null;
Scene.SceneBase.resetTo		= null;
Scene.SceneBase._date		= null;
Scene.SceneBase._initsFirst	= false;
Scene.SceneBase._countUntilSaveRunTime	= 0;


})();	//File Scope

