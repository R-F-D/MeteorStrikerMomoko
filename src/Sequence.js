/* *******************************************************************************
	シークエンスクラス
********************************************************************************/
var cc;

/** シークエンス実体クラス
 * @class Sequence
 */
class Sequence{
	constructor(){
		/** @var 単純遷移における次フェイズ */
		this.nextSequence		= null;
		/** @var イベントリスナの対象レイヤ */
		this.listenTargetLayer	= null;
		/** @var 設定されたイベントリスナ群 */
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
			//共通イベント
			for(let i in Sequence._commonEventListeners){
				cc.eventManager.addListener(Sequence._commonEventListeners[i],this.listenTargetLayer);
			}
			//個別イベント
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

	/** 共通イベントリスナを設定
	 * @static
	 * @param {*} listeners
	 * @memberof Sequence
	 */
	static SetCommonEventListeners(listeners){
		if(Array.isArray(listeners))	Sequence._commonEventListeners	= listeners;
		else							Sequence._commonEventListeners	= [listeners];
	}

	/** 単純遷移における次フェイズを設定または取得
	 * @param {*} nextSeq 省略時はゲッタとして機能
	 * @returns {this|Sequenxe} セッタ時this、ゲッタ時Sequenceインスタンス
	 * @memberof Sequence
	 */
	NextPhase(nextSeq=undefined){
		if(nextSeq==undefined){
			return this.nextSequence;
		}
		else{
			this.nextSequence	= nextSeq;
			return this;
		}
	}

}

Sequence._commonEventListeners	= [];
