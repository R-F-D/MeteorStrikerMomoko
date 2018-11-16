/* *******************************************************************************
	シークエンスクラス
********************************************************************************/
var cc;


/** シークエンス実体クラス
 * @class Sequence
 */
class Sequence{
	constructor(){
		this.listenTargetLayer	= null;
		this.eventListeners		= [];
		this.Init();
	}

	/** インスタンス生成
	 * @static
	 * @returns this
	 * @memberof Sequence
	 */
	static Create(){return new this();}

	/** 初期化
	 * @returns this
	 * @memberof Sequence
	 */
	Init(){
		//イベントリスナ
		if(this.listenTargetLayer){
			cc.eventManager.removeListeners(this.listenTargetLayer);
			for(let i in this.eventListeners){
				cc.eventManager.addListener(this.eventListeners[i],this.listenTargetLayer);
			}
		}
		return this;
	}

	/** イベントリスナの対象レイヤを設定
	 * @param {*} layer
	 * @returns
	 * @static
	 * @memberof Sequence
	 */
	SetListenerTarget(layer){
		this.listenTargetLayer	= layer;
		return this;
	}

	/** イベントリスナを設定
	 * @param {*} listeners
	 * @returns
	 * @memberof Sequence
	 */
	SetEventListeners(listeners){
		if(Array.isArray(listeners))	this.eventListeners	= listeners;
		else							this.eventListeners	= [listeners];
		return this;
	}
}

