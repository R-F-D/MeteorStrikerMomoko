/* *******************************************************************************
	シーン基本クラス
********************************************************************************/
var Scenes	= Scenes || {};
var cc;

/** シーン基本クラス */
Scenes.SceneBase	= class {

	constructor(){

		/** @var number シーン内のシークエンス */
		this.sequence			= 0;
		/** @var {boolean} シークエンス遷移が可能か */
		this.isSequenceMovable	= false;

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
	}

	/** シーンの更新処理 共通部分
	 * @param {*} dt
	 */
	OnUpdating(dt){}
	/** シーンの更新処理 共通部分
	 * @param {*} dt
	 */
	OnUpdated(dt){}

	/** Create Instance */
	static Create(){return new this();}
	/** Get cc.Scene Instance */
	GetCcSceneInstance(){return this.ccSceneInstance;	}

	/** レイヤ内容の変更
	 * @param {*} layerTag,
	 * @param {*} nextLayerInstance
	 * @param {Number} zOrder Zオーダー
	 */
	SetLayer(layerTag,nextLayer,zOrder=0){
		if(!nextLayer)	return null;

		if(this.ccLayerInstances[layerTag]){
			this.ccLayerInstances[layerTag].unscheduleUpdate();
			this.ccSceneInstance.removeChildByTag(layerTag);
		}
		this.ccLayerInstances[layerTag]	= new nextLayer();
		this.ccSceneInstance.addChild(this.ccLayerInstances[layerTag], zOrder, layerTag	);

		return this.ccLayerInstances[layerTag];
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

}//class
