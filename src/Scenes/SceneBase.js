/* *******************************************************************************
	シーン基本クラス
********************************************************************************/
var Scenes	= Scenes || {};
var cc;

/** シーン基本クラス */
Scenes.SceneBase	= class {

	constructor(){

		/** @var number シーン内のシークエンス */
		this.seq				= 0;

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


}//class

