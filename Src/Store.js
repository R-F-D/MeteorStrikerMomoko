/* *******************************************************************************
	ストレージ操作関数群
********************************************************************************/
class Store{

	/** ストレージのレコードハンドル */
	static get Handles(){
		return {
			GamePlay: {
				/** @const ハイスコア*/
				HighScore:					{Key:"GamePlay.HighScore",					UnitKey:"Unit.Distance",Required:0,		Order:0x0000,	nDecimalDigits:0,	},
				/** @const グッド回数 */
				NumGoods:					{Key:"GamePlay.NumGoods",					UnitKey:null,			Required:0,		Order:0x0200,	nDecimalDigits:0,	},
				/** @const パーフェクト回数 */
				NumPerfects:				{Key:"GamePlay.NumPerfects",				UnitKey:null,			Required:0,		Order:0x0201,	nDecimalDigits:0,	},
				/** @const 100%パーフェクト回数 */
				NumTruePerfects:			{Key:"GamePlay.NumTruePerfects",			UnitKey:null,			Required:1,		Order:0x0202,	nDecimalDigits:0,	},
				/** @const エイミング精度最高値 */
				BestAiming:					{Key:"GamePlay.BestAiming",					UnitKey:"Unit.Aim",		Required:0,		Order:0x0203,	nDecimalDigits:1,	},
				/** @const 強打回数 */
				NumHardBlowings:			{Key:"GamePlay.NumHardBlowings",			UnitKey:null,			Required:0,		Order:0x0300,	nDecimalDigits:0,	},
				/** @const 軽打回数 */
				NumLightBlowings:			{Key:"GamePlay.NumLightBlowings",			UnitKey:null,			Required:0,		Order:0x0301,	nDecimalDigits:0,	},
				/** @const 最高打撃力 */
				BestBlowing:				{Key:"GamePlay.BestBlowing",				UnitKey:"Unit.Blow",	Required:0,		Order:0x0302,	nDecimalDigits:1,	},
				/** @const 強打とパーフェクトを同時に出した回数 */
				NumHardAndPerfectBlowings:	{Key:"GamePlay.NumHardAndPerfectBlowings",	UnitKey:null,			Required:1,		Order:0x0303,	nDecimalDigits:0,	},
				/** @const 連続で打撃に成功した数 */
				NumSuccessiveHits:			{Key:"GamePlay.NumSuccessiveusHits",		UnitKey:null,			Required:null,	Order:0x0300,	nDecimalDigits:0,	},
				/** @const 連続で打撃に成功した最多数 */
				MaxSuccessiveHits:			{Key:"GamePlay.MaxSuccessiveusHits",		UnitKey:null,			Required:0,		Order:0x0304,	nDecimalDigits:0,	},
				/** @const 最大エミット倍率 */
				MaxEmittings:				{Key:"GamePlay.MaxEmittings",				UnitKey:"Unit.Emit",	Required:0,		Order:0x0400,	nDecimalDigits:1,	},
			},

			Action: {
				/** @const プレイ回数 */
				NumPlayings:				{Key:"Action.NumPlayings",					UnitKey:null,			Required:0,		Order:0x0100,	nDecimalDigits:0,	},
			},

			Settings:{
				/** @const 言語設定 */
				Language:					{Key:"Settings.Language",					UnitKey:null,			Required:null,		Order:0x0100,	nDecimalDigits:0,	},
				/** @const 数値の区切り設定 */
				NumberSeparation:			{Key:"Settings.NumberSeparation",			UnitKey:null,			Required:null,		Order:0x0100,	nDecimalDigits:0,	},
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
	 * @param {string} handle ストレージのレコードハンドル
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

	/** ローカルストレージからのロード
	 * @static
	 * @param {string} key				ストレージのハンドル
	 * @param {*} [defaultValue=null]	デフォルト値
	 * @returns
	 * @memberof Store
	 */
	static Select(handle,defaultValue=null){
		if(typeof handle==="string")	return cc.sys.localStorage.getItem(handle) || defaultValue;
		else							return cc.sys.localStorage.getItem(handle.Key) || defaultValue;
	}

	/** 表示可能なレコードのハンドル一覧を得る
	 * @readonly
	 * @static
	 * @memberof Store
	 */
	static get visibleHandles(){
		let handles	= [];
		_(Store.Handles).forEach(
			category=> _.filter(category,v=>v.Required!==null).forEach(h=>handles.push(h))
		);
		return _.orderBy(handles,"Order");
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


