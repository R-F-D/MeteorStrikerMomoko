/* *******************************************************************************
	ストレージ操作関数群
********************************************************************************/
var Store	= Store || {};

/** @const ストレージのキー */
Store.Keys = {

	GamePlay: {
		/** @const ハイスコア*/
		HighScore:					"GamePlay.HighScore",
		/** @const パーフェクト回数 */
		NumGoods:					"GamePlay.NumGoods",
		/** @const パーフェクト回数 */
		NumPerfects:				"GamePlay.NumPerfects",
		/** @const 100%パーフェクト回数 */
		NumTruePerfects:			"GamePlay.NumTruePerfects",
		/** @const エイミング精度最高値 */
		BestAiming:					"GamePlay.BestAiming",
		/** @const 強打回数 */
		NumHardBlowings:			"GamePlay.NumHardBlowings",
		/** @const 軽打回数 */
		NumLightBlowings:			"GamePlay.NumLightBlowings",
		/** @const 最高打撃力 */
		BestBlowing:				"GamePlay.BestBlowing",
		/** @const 強打とパーフェクトを同時に出した回数 */
		NumHardAndPerfectBlowings:	"GamePlay.NumHardAndPerfectBlowings",
		/** @const 連続で打撃に成功した数 */
		NumSuccessiveHits:			"GamePlay.NumSuccessiveusHits",
		/** @const 連続で打撃に成功した最多数 */
		MaxSuccessiveHits:			"GamePlay.MaxSuccessiveusHits",
		/** @const 最大エミット */
		MaxEmittings:				"GamePlay.MaxEmittings"
	},

	Action: {
		/** @const プレイ回数 */
		NumPlayings:				"Action.NumPlayings",
	},
};


/** ローカルストレージにインサート
 * @param {string} key 保存するキー文字列
 * @param {*} value 保存する値。ただしインサート成功時にコールバック関数が実行されたときはその返り値
 * @param {function} [cond=null] インサート条件（保存時は真を返す）。
 * @param {function} [resolve=null] インサート成功時コールバック
 * @returns {*} 保存時は新値、未保存時は旧値
 */
Store.Insert	= function Insert(key,value,cond=Store.Conds.NewValueIsGreater,resolve=null){
	const oldValue	= cc.sys.localStorage.getItem(key);

	if(cond(oldValue,value)){
		cc.sys.localStorage.setItem(key,value);
		if(resolve)	{
			const result = resolve(key,value);
			return result===undefined ? value : result;	//コールバック関数が実行された場合は戻り値を返す（undefinedを除く）
		};
		return value;
	}
	else{
		return oldValue;
	}
};

/** ローカルストレージにインサート（値は動的に生成）
 * @param {string} key ストレージのキー
 * @param {function} [valueGenerator=null] 現在値を受け取り新値を返す関数。
 * @returns 新しい値
 */
Store.DynamicInsert	= function DynamicInsert(key,valueGenerator=Store.Gens.Increment){
	const oldValue	= cc.sys.localStorage.getItem(key);
	const value		= valueGenerator(oldValue);

	cc.sys.localStorage.setItem(key,value);
	return value;
};


//----------------------------------------
//	コールバック
//----------------------------------------
/** インサート条件関数
 * @type {<string,function>}	f(currentValue,newValue):boolean
 */
Store.Conds	= {
	/** 現在値が空欄のとき真 */
	CurrentValueIsEmpty	: (currentValue,newValue)=>	currentValue==null || currentValue=="",
	/** 挿入値が現在値より大きいとき真 */
	NewValueIsGreater	: (currentValue,newValue)=>	(currentValue||0) < newValue,
};

/** @const 挿入値の生成関数
 * @type {<string,function>}	f(value):any
 */
Store.Gens	= {
	/** インクリメント */
	Increment:	value=>	(value==null||value=="") ? 1 : Number(value)+1,

};
