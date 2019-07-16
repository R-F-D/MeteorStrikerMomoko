/* *******************************************************************************
	ストレージ操作関数群
********************************************************************************/
class Store{

	/** ストレージのレコードハンドル */
	static get Handles(){
		let container	= {
			GamePlay: {
				/** ハイスコア*/
				HighScore:					{Required:0,	Order:0x1000,	UnitKey:"Unit.Distance",	},
				/** 直近の平均飛距離 */
				MeanDistance:				{Required:0,	Order:0x1001,	UnitKey:"Unit.Distance",	},
				/** チェックポイント到達回数 */
				NumPassings:[				{Required:1,	Order:0x1100,	},		//太陽
											{Required:1,	Order:0x1100,	},		//きらり
											{Required:1,	Order:0x1100,	},	],	//ユニコーン

				/** グッド回数 */
				NumGoods:					{Required:0,	Order:0x2000,	},
				/** パーフェクト回数 */
				NumPerfects:				{Required:0,	Order:0x2001,	},
				/** 100%パーフェクト回数 */
				NumTruePerfects:			{Required:1,	Order:0x2002,	},
				/** エイミング精度最高値 */
				BestAiming:					{Required:0,	Order:0x2003,	nDecimalDigits:1,	UnitKey:"Unit.Aim",	},
				/** 平均エイミング精度 */
				MeanAiming:					{Required:0,	Order:0x2004,	nDecimalDigits:1,	UnitKey:"Unit.Aim",	},
				/** 強打回数 */
				NumHardBlowings:			{Required:0,	Order:0x2010,	},
				/** 全力打撃回数 */
				NumFullPowerBlowings:		{Required:1,	Order:0x2011,	},
				/** 強打＆パーフェクト回数 */
				NumHardAndPerfectBlowings:	{Required:1,	Order:0x2012,	},
				/** 最高打撃力 */
				BestBlowing:				{Required:0,	Order:0x2013,	nDecimalDigits:1,	UnitKey:"Unit.Blow",	},
				/** 平均打撃倍率 */
				MeanBlowing:				{Required:0,	Order:0x2014,	nDecimalDigits:1,	UnitKey:"Unit.Blow",	},

				/** 最大エミット倍率 */
				MaxEmittings:				{Required:0,	Order:0x3000,	nDecimalDigits:1,	UnitKey:"Unit.Emit",	},
				/** 平均エミット倍率 */
				MeanEmitting:				{Required:0,	Order:0x3001,	nDecimalDigits:1,	UnitKey:"Unit.Emit",	},
				/** 最高連続打撃成功数 */
				MaxSuccessiveHits:			{Required:0,	Order:0x3010,	},
				/** 連続打撃成功数 */
				NumSuccessiveHits:			{},
			},
			Action: {
				/** プレイ回数 */
				NumPlays:					{Required:0,	Order:0x0100,	},
				/** 起動回数 */
				NumBootings:				{Required:0,	Order:0x0101,	},
				/** リトライ回数 */
				NumRetrys:					{Required:0,	Order:0x0102,	},
				/** シェア回数 */
				NumShares:					{Required:0,	Order:0x0103,	},
				/** ナビゲーション回数 */
				NumNavigates:[				{Required:1,	Order:0x4000,	},		//ノーマル
											{Required:1,	Order:0x4000,	},	],	//初めてのともだち
				/** タイトル画面でプレイヤーキャラをタッチした回数 */
				NumTouchesPlayer:			{Required:1,	Order:0x4001,	},

			},
			Settings:{
				/** 言語設定 */
				Language:					{},
				/** 数値の区切り設定 */
				NumberSeparation:			{},
			},
		};

		//動的プロパティの生成
		_(container).forEach( (handles,category) =>	_(handles).forEach(
			(handle,key) =>	{
				_.castArray(handle)
					.forEach((h,i)=>{
						h.isVirtual	= false;
						h.Key 		= Array.isArray(handle)	? `${category}.${key}.${String(i).padStart(2,'0')}`
															: `${category}.${key}`;
						const convs	= Store._RecordConverter;
						h.Conv		= convs[category] && convs[category][key] || null;
					});
			}
		));
		return container;
	}

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


	/** ログ取得・保存
	 * @static
	 * @param {*} handle ストレージのレコードハンドル
	 * @param {*} value 保存時は挿入する値。取得時はnull。
	 * @param {number} [nlogs=5] ログの保存件数
	 * @returns {array} ログの配列
	 * @memberof Store
	 */
	static Log(handle,value=null,nlogs=7){
		let result = [];
		Store.DynamicInsert(handle,currentString=>{
			let logs = currentString	?	currentString.split("\n",5).map(v=>Number(v))	: [];
			if(value)	logs.push(value);
			result	= _(logs).takeRight(nlogs);
			return result.join("\n");
		});
		return result;
	}

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
		let results	= [];

		[Store.Handles, Store.VirtualHandles].forEach(container=>
			_(container).forEach(category=>{	//カテゴリ舞のループ
				_(category).forEach(handles=>{	//ハンドルのループ
					_(handles).castArray()		//配列化してからループ
						.filter(v=>{
							if(Array.isArray(v))	return true;
							if(v.Required===undefined || v.Required===null)	return false;
							else if (page===undefined || page      ===null)	return true;
							return Math.abs(page) == Math.trunc(v.Order/(16**3));
						})
						.forEach(h=>results.push(h));
				});
			})
		);

		return _.orderBy(results,"Order");
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

	/** 挿入値の生成関数
	 * @type {<string,function>}	f(value):any
	 */
	static get Gens() {
		return{
			/** インクリメント */
			Increment:				value=>	(value==null||value=="") ? 1 : Number(value)+1,
		};
	};

	//Records用の生成関数
	static get _RecordConverter(){
		const StrToMean	= str=>{
			let ary	= String(str).split("\n",5);
			return ary ? ary.reduce((acc,cur)=>acc+Number(cur),0) / ary.length : 0;
		};

		return {
			GamePlay:{
				MeanDistance:	(value)=>StrToMean(value),
				MeanBlowing:	(value)=>StrToMean(value),
				MeanAiming:		(value)=>StrToMean(value),
				MeanEmitting:	(value)=>StrToMean(value),
			},
		};
	}
} // class


