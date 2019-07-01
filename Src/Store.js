/* *******************************************************************************
	ストレージ操作関数群
********************************************************************************/
class Store{

	/** ストレージのレコードハンドル */
	static get Handles(){
		let container	= {
			GamePlay: {
				/** @const ハイスコア*/
				HighScore:					{Required:0,		Order:0x0000,	nDecimalDigits:0,	UnitKey:"Unit.Distance",},
				/** @const グッド回数 */
				NumGoods:					{Required:0,		Order:0x0200,	nDecimalDigits:0,	UnitKey:null,			},
				/** @const パーフェクト回数 */
				NumPerfects:				{Required:0,		Order:0x0201,	nDecimalDigits:0,	UnitKey:null,			},
				/** @const 100%パーフェクト回数 */
				NumTruePerfects:			{Required:1,		Order:0x0202,	nDecimalDigits:0,	UnitKey:null,			},
				/** @const エイミング精度最高値 */
				BestAiming:					{Required:0,		Order:0x0203,	nDecimalDigits:1,	UnitKey:"Unit.Aim",		},
				/** @const 強打回数 */
				NumHardBlowings:			{Required:0,		Order:0x0300,	nDecimalDigits:0,	UnitKey:null,			},
				/** @const 軽打回数 */
				NumLightBlowings:			{Required:0,		Order:0x0301,	nDecimalDigits:0,	UnitKey:null,			},
				/** @const 最高打撃力 */
				BestBlowing:				{Required:0,		Order:0x0302,	nDecimalDigits:1,	UnitKey:"Unit.Blow",	},
				/** @const 強打とパーフェクトを同時に出した回数 */
				NumHardAndPerfectBlowings:	{Required:1,		Order:0x0303,	nDecimalDigits:0,	UnitKey:null,			},
				/** @const 連続で打撃に成功した数 */
				NumSuccessiveHits:			{},
				/** @const 連続で打撃に成功した最多数 */
				MaxSuccessiveHits:			{Required:0,		Order:0x0304,	nDecimalDigits:0,	UnitKey:null,			},
				/** @const 最大エミット倍率 */
				MaxEmittings:				{Required:0,		Order:0x0400,	nDecimalDigits:1,	UnitKey:"Unit.Emit",	},
			},

			Action: {
				/** @const プレイ回数 */
				NumPlayings:				{Required:0,		Order:0x1100,	nDecimalDigits:0,	UnitKey:null,			},
			},

			Settings:{
				/** @const 言語設定 */
				Language:					{},
				/** @const 数値の区切り設定 */
				NumberSeparation:			{},
			},
		};

		//Keyプロパティの生成
		_(container).forEach(
			( handles,category) =>	_(handles).forEach(
				(h,key) =>	h.Key = `${category}.${key}`
			)
		);
		return container;
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
		if(cond===null)	cond = Store.Conds.Always;

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
	static GetVisibleHandles(page=null){
		let handles	= [];
		_(Store.Handles).forEach(
			category=>
				_.filter(category,v=>{
					if(v.Required===undefined || v.Required===null)	return false;
					else if (page===undefined || page      ===null)	return true;

					return Math.abs(page) == Math.trunc(v.Order/(16**3));
				})
				.forEach(h=>handles.push(h))
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
			Always:					(currentValue,newValue)=>	true,
			/** 現在値が空欄のとき真 */
			CurrentValueIsEmpty:	(currentValue,newValue)=>	currentValue==null || currentValue=="",
			/** 現在値と挿入値を数値化し、後者が大きいとき真 */
			NewValueIsGreater:		(currentValue,newValue)=>	Number(currentValue||0) < Number(newValue),
		};
	};

	/** @const 挿入値の生成関数
	 * @type {<string,function>}	f(value):any
	 */
	static get Gens() {
		return{
			/** インクリメント */
			Increment:				value=>	(value==null||value=="") ? 1 : Number(value)+1,
		};
	};

} // class


