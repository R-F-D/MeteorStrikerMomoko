/* *******************************************************************************
	地域設定
********************************************************************************/
var LocaleSetting	= LocaleSetting | {};
(function(){	//File Scope

/**地域設定クラス*/
LocaleSettings	= class{
	constructor(){

		/**テキストの言語*/
		this.language			= 'ja';
		/**数値の区切り方法*/
		this.numericSeparation	= 'JP';

		if(!NumericSeparators[this.numericSeparation])	this.numericSeparation	= '_default';
	}


	/** 数値に区切り文字を挿入
	 * @param {number} value 整数
	 * @returns {string}
	 */
	NumToStr(value){
		const separation	= NumericSeparators[this.numericSeparation];

		//数値を区切りごとに配列に分割
		const nDigits	= Math.trunc(Math.max(1,separation.nDigits));	//区切り桁数
		const chunks	= this._SplitNumber(Math.trunc(value),nDigits);

		//区切りを挿入
		if(!Array.isArray(separation.integer)){	//区切りが文字のときは全ての区切りに挿入
			return chunks.join(separation.integer);
		}
		else{									//配列のときは１つずつ区切り文字を変える
			let str	= '';
			for(let i=0; i<chunks.length; ++i){
				if(i==0){
					str	= `${chunks[0]}`;
				}
				else{
					const separator	= separation.integer.length < i ? '' : separation.integer[i-1];
					str	= `${chunks[i]}${separator}${str}`;
				}
			}
			return str;
		}
	}

	/** 数値を一定桁数で区切った配列に変換する
	 * @private
	 * @param {number} value		対象の値。0以上の整数。
	 * @param {number} nDigits		区切りの桁数
	 * @param {Array} [chunks=[]]	結果の配列。再帰処理用のため通常は省略。
	 * @returns
	 */
	_SplitNumber(value,nDigits,chunks=[]){
		if	(nDigits<1) throw new Error("Argument 'nDigits' must be 1 or more, and an integer.");

		const denominator	= 10 ** nDigits;
		chunks.push( value % denominator );
		const truncated		= Math.trunc( value/denominator );

		//再帰処理
		if(truncated > 0)	return this._SplitNumber(truncated,nDigits,chunks);
		else				return chunks;
	}


};


/**
 * 数値の区切り
 */
NumericSeparators	= {
	//国際度量衡総会 General Conference on Weights and Measures
	_default:{
		nDigits:	3,
		integer:	' ',
		decimal:	'.',
	},
	//アメリカ USA
	US:{
		nDigits:	3,
		integer:	',',
		decimal:	'.',
	},
	//日本 Japan
	JP:{
		nDigits:	4,
		integer:	['万','億','兆',],
		decimal:	'.',
	},
};

})();	//File Scope

var Locale	= new LocaleSettings();



