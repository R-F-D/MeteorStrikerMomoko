/********************************************************************************
	地域設定
********************************************************************************/
var _;
var Store;
var LocalizedTexts,NumericSeparators;

/**地域設定クラス*/
 var Locale	= class Locale{

	constructor(){
		/**テキストの言語*/
		this.language			= Locale.UniversalCode
		/**数値の区切り方法*/
		this.numericSeparation	= Locale.UniversalCode;
	}

	/** 言語コードをセットする
	 * @param {string} langCode
	 */
	SetLanguage(langCode=Locale.UniversalCode){
		this.language	= langCode;
		return this;
	}
	/** 設定されている言語コードを取得 */
	GetLanguageCode(){return this.language}

	/** 数字区切りの言語をセットする
	 * @param {string} langCode
	 */
	SetNumberSeparation(langCode=Locale.UniversalCode){
		this.numericSeparation	= langCode;
		if(!NumericSeparators[this.numericSeparation])	this.numericSeparation	= Locale.UniversalCode;
		return this;
	}
	/** 設定されている数値区切りの言語コードを取得*/
	GetNumberSepararionCode(){return this.numericSeparation;}


	/** テキスト識別子に対応したテキストを返す
	 * @param {string} textCode		テキスト識別子
	 * @param {string?} [lang=null]	言語。省略時はすでに設定されている言語。
	 * @returns {string}		対応するテキスト
	 */
	Text(textCode,lang=null){
		if(!LocalizedTexts[textCode])	throw new Error(`Text '${textCode}' is not found.`);
		const lines	= LocalizedTexts[textCode][lang||this.language] || LocalizedTexts[textCode][`_`] || '';
		return Array.isArray(lines)	? lines.join(" \n")	: lines;
	}

	/** テキスト識別子に対応したテキストを返す（フォーマット付き）
	 * @param {*string} textCode		テキスト識別子（置換箇所は$0 $1 $2...）
	 * @param {array} [replacements=[]]	置換文字列の配列
	 * @param {string?} [lang=null]		言語。省略時はすでに設定されている言語。
	 * @returns							対応するテキスト
	 */
	Textf(textCode,replacements=[],lang=null){
		if(!LocalizedTexts[textCode])	throw new Error(`Text '${textCode}' is not found.`);

		return	_(replacements).reduceRight(
					(result,replacement,i)=>	result.replace(`$${i}`,	_.isFunction(replacement) ? replacement() : replacement	),
					this.Text(textCode,lang)
				);
	}

	/** 識別子に対応するテキストが存在するか
	 * @param {string} textCode		テキスト識別子
	 * @param {string} [lang=null]	言語。省略時は言語を問わない
	 * @returns
	 */
	TextExists(textCode,lang=null){
		if(lang)return !!(LocalizedTexts[textCode] && LocalizedTexts[textCode][lang]);
		else	return !!LocalizedTexts[textCode];
	}


	/** 数値に区切り文字を挿入
	 * @param {number} value		整数
	 * @param {number?} [nDecimalDigits=0] 小数点以下の桁数
	 * @param {string?} [lang=null]	言語。省略時はすでに設定されている言語。
	 * @returns {string}
	 */
	NumToStr(value,nDecimalDigits=0, lang=null){
		value			= Number(value);
		const separation= NumericSeparators[lang||this.numericSeparation] || NumericSeparators[Locale.UniversalCode];

		//数値を区切りごとに配列に分割
		const nDigits		= Math.trunc(Math.max(1,separation.nDigits));	//区切り桁数
		const decimalPart	= (String(value).split(".")[1] || "0000000000000000").substr(0,nDecimalDigits);
		const chunks		= this._SplitNumber(Math.trunc(value),nDigits);

		//区切りを挿入
		let integerPart	= "";
		if(!Array.isArray(separation.integer)){	//区切りが文字のときは全ての区切りに挿入
			integerPart	= chunks
							.reverse()
							.map((v,i)=> i==0 ? `${v}` : `${v}`.padStart(nDigits,'0') )
							.join(separation.integer);
		}
		else{									//配列のときは１つずつ区切り文字を変える
			let str	= '';
			for(let i=0; i<chunks.length; ++i){
				if(chunks[i]===0)	continue;
				if(i==0){
					str	= `${chunks[0]}`;
				}
				else{
					const separator	= separation.integer.length < i ? '' : separation.integer[i-1];
					str	= `${chunks[i]}${separator}${str}`;
				}
			}
			integerPart	= str||"0";
		}

		if(nDecimalDigits)	return `${integerPart}${separation.decimal}${decimalPart}`;
		else				return integerPart;
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

	/** 地域設定のセーブ
	 * @returns this
	 */
	Save(){
		Store.Insert( Store.Handles.Settings.Language,			this.language,			null	);
		Store.Insert( Store.Handles.Settings.NumberSeparation,	this.numericSeparation,	null	);
		return this;
	}

	/** 地域設定のロード
	 * @returns this
	 */
	Load(){
		this.SetLanguage(			Store.Select(Store.Handles.Settings.Language,			"ja"));
		this.SetNumberSeparation(	Store.Select(Store.Handles.Settings.NumberSeparation,	"ja"));
		return this;
	}

	/** プリセット取得
	 * @param {string} [key=Locale.UniversalCode]
	 * @returns
	 */
	GetPreset(key=Locale.UniversalCode){
		if(LocalePresets[key])	return LocalePresets[key];
		return LocalePresets[_];
	}

	/** プリセット適用
	 * @param {string} [key=Locale.UniversalCode]
	 * @returns
	 */
	ApplyPreset(key=Locale.UniversalCode){
		const preset	= this.GetPreset(key);
		this.language			= preset.language;
		this.numericSeparation	= preset.numericSeparation;
		this.Save();
		return this;
	}

	GetCurrentPresetKey(){
		const key	= _(LocalePresets).findKey(p=> this.language==p.language && this.numericSeparation==p.numericSeparation);
		return key || Locale.UniversalCode;
	}

}
/** グローバルの言語コード  */
Locale.UniversalCode	= "_";

const LocalePresets	= {
	_	:{	language:Locale.UniversalCode,	numericSeparation:Locale.UniversalCode,	},
	en	:{	language:"en",	numericSeparation:"en",	},
	ja	:{	language:"ja",	numericSeparation:"ja",	},
};


var L	= (new Locale()).Load().Save();
