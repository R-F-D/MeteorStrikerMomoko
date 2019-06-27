/* *******************************************************************************
	ストレージ操作関数群
********************************************************************************/
class Store{

	/** ストレージのキー */
	static get Handles(){
		return {
			GamePlay: {
				/** @const ハイスコア*/
				HighScore:					{Key:"GamePlay.HighScore",					Required:0,		Index:0x0000,	},
				/** @const グッド回数 */
				NumGoods:					{Key:"GamePlay.NumGoods",					Required:0,		Index:0x0200,	},
				/** @const パーフェクト回数 */
				NumPerfects:				{Key:"GamePlay.NumPerfects",				Required:0,		Index:0x0201,	},
				/** @const 100%パーフェクト回数 */
				NumTruePerfects:			{Key:"GamePlay.NumTruePerfects",			Required:1,		Index:0x0202,	},
				/** @const エイミング精度最高値 */
				BestAiming:					{Key:"GamePlay.BestAiming",					Required:0,		Index:0x0203,	},
				/** @const 強打回数 */
				NumHardBlowings:			{Key:"GamePlay.NumHardBlowings",			Required:0,		Index:0x0300,	},
				/** @const 軽打回数 */
				NumLightBlowings:			{Key:"GamePlay.NumLightBlowings",			Required:0,		Index:0x0301,	},
				/** @const 最高打撃力 */
				BestBlowing:				{Key:"GamePlay.BestBlowing",				Required:0,		Index:0x0302,	},
				/** @const 強打とパーフェクトを同時に出した回数 */
				NumHardAndPerfectBlowings:	{Key:"GamePlay.NumHardAndPerfectBlowings",	Required:1,		Index:0x0303,	},
				/** @const 連続で打撃に成功した数 */
				NumSuccessiveHits:			{Key:"GamePlay.NumSuccessiveusHits",		Required:null,	Index:0x0300,	},
				/** @const 連続で打撃に成功した最多数 */
				MaxSuccessiveHits:			{Key:"GamePlay.MaxSuccessiveusHits",		Required:0,		Index:0x0304,	},
				/** @const 最大エミット倍率 */
				MaxEmittings:				{Key:"GamePlay.MaxEmittings",				Required:0,		Index:0x0400,	},
			},

			Action: {
				/** @const プレイ回数 */
				NumPlayings:				{Key:"Action.NumPlayings",					Required:0,		Index:0x0100,	},
			},
		};
	};


	/** ローカルストレージにインサート
	 * @param {Object} handle ストレージのハンドル
	 * @param {*} value 保存する値。ただしインサート成功時にコールバック関数が実行されたときはその返り値
	 * @param {function} [cond=null] インサート条件（保存時は真を返す）。
	 * @param {function} [resolve=null] インサート成功時コールバック
	 * @returns {*} 保存時は新値、未保存時は旧値
	 */
	static Insert(handle,value,cond=Store.Conds.NewValueIsGreater,resolve=null){
		const oldValue	= cc.sys.localStorage.getItem(handle.Key);

		if(cond(oldValue,value)){
			//インサート実行
			cc.sys.localStorage.setItem(handle.Key,value);
			//成功時コールバック
			if(resolve)	{
				const result = resolve(handle.Key,value);
				return result===undefined ? value : result;	//コールバック関数が実行された場合は戻り値を返す（undefinedを除く）
			};
			return value;
		}
		else{
			//インサートしない場合
			return oldValue;
		}
	};

	/** ローカルストレージにインサート（値は動的に生成）
	 * @param {string} handle ストレージのハンドル
	 * @param {function} [valueGenerator=null] 現在値を受け取り新値を返す関数。
	 * @returns 新しい値
	 */
	static DynamicInsert(handle,valueGenerator=Store.Gens.Increment){
		//挿入値の生成
		const oldValue	= cc.sys.localStorage.getItem(handle.Key);
		const value		= valueGenerator(oldValue);

		cc.sys.localStorage.setItem(handle.Key,value);
		return value;
	};


/** ストレージハンドルの個数
 * @returns {number}
 */
static GetNumHandles(){
	if(Store._numVisibleHandles===null){
		Store._numVisibleHandles	= _(Store.Handles).reduce(
			(sum,category)=> sum + _.filter(category,v=>v.Required!==null).length,
			0
		);
	}
	return Store._numVisibleHandles;
}


//----------------------------------------
//	コールバック
//----------------------------------------
/** インサート条件関数
 * @type {<string,function>}	f(currentValue,newValue):boolean
 */
static get Conds() {
	return{
		/** 現在値が空欄のとき真 */
		CurrentValueIsEmpty	: (currentValue,newValue)=>	currentValue==null || currentValue=="",
		/** 現在値と挿入値を数値化し、後者が大きいとき真 */
		NewValueIsGreater	: (currentValue,newValue)=>	Number(currentValue||0) < Number(newValue),
	};
};

/** @const 挿入値の生成関数
 * @type {<string,function>}	f(value):any
 */
static get Gens() {
	return{
		/** インクリメント */
		Increment:	value=>	(value==null||value=="") ? 1 : Number(value)+1,
	};
};

} // class
Store._numVisibleHandles	= null;
