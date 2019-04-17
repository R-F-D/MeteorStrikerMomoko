/********************************************************************************
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
		this.numericSeparation	= 'ja';

		if(!NumericSeparators[this.numericSeparation])	this.numericSeparation	= '_';
	}


	/** テキスト識別子に対応したテキストを返す
	 * @param {string} textCode		テキスト識別子
	 * @param {string?} [lang=null]	言語。省略時はすでに設定されている言語。
	 * @returns {string}		対応するテキスト
	 */
	Text(textCode,lang=null){
		if(!Texts[textCode])	throw new Error(`Text '${textCode}' is not found.`);
		return Texts[textCode][lang||this.language] || Texts[textCode][`_`] || '';
	}

	/** テキスト識別子に対応したテキストを返す（フォーマット付き）
	 * @param {*string} textCode		テキスト識別子（置換箇所は$0 $1 $2...）
	 * @param {array} [replacements=[]]	置換文字列の配列
	 * @param {string?} [lang=null]		言語。省略時はすでに設定されている言語。
	 * @returns							対応するテキスト
	 */
	Textf(textCode,replacements=[],lang=null){
		if(!Texts[textCode])	throw new Error(`Text '${textCode}' is not found.`);

		let	text	= this.Text(textCode,lang);
		for(let i=replacements.length-1; i>=0; --i){
			text	= text.replace(`$${i}`,replacements[i]);
		}
		return text;
	}


	/** 数値に区切り文字を挿入
	 * @param {number} value		整数
	 * @param {string?} [lang=null]	言語。省略時はすでに設定されている言語。
	 * @returns {string}
	 */
	NumToStr(value,lang){
		const separation	= NumericSeparators[lang||this.numericSeparation] || NumericSeparators["_"];

		//数値を区切りごとに配列に分割
		const nDigits	= Math.trunc(Math.max(1,separation.nDigits));	//区切り桁数
		const chunks	= this._SplitNumber(Math.trunc(value),nDigits);

		//区切りを挿入
		if(!Array.isArray(separation.integer)){	//区切りが文字のときは全ての区切りに挿入
			return	chunks
						.reverse()
						.map((v,i)=>{ return i==0 ? `${v}` : `${v}`.padStart(nDigits,'0') })
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


/********************************************************************************
 * 数値の区切り
 *******************************************************************************/
NumericSeparators	= {
	//国際度量衡総会 General Conference on Weights and Measures
	_:{
		nDigits:	3,	//How many every digits
		integer:	' ',	//Integer separator
		//integer:	["T","M","B"],	//	If the separators are different, set an array
		decimal:	'.',	//Decimal separator
	},
	//英語 English
	en:{
		nDigits:	3,
		integer:	',',
		decimal:	'.',
	},
	//日本 Japanese
	ja:{
		nDigits:	4,
		integer:	['万','億',],
		decimal:	'.',
	},
};


/********************************************************************************
 * テキスト
 *******************************************************************************/
Texts	= {
	"GamePlay.Distance.Unit":	{	_: "km",	},
	"GamePlay.Charge.Unit":	{	_: "%",	},

	"GamePlay.Navigator.Aim":	{	_:"Take aim and long tap to charge.",	ja:"ねらいを定めて長押ししてね",	},
	"GamePlay.Navigator.Preliminary":	{	_:"Release to attack.",	ja:"はなすと攻撃だよ",	},
	"GamePlay.Navigator.Fail":	{	_:"Release at the right time.",	ja:"タイミングよく はなしてね",	},
	"GamePlay.Navigator.Emit":	{	_:"The power rises with taps.",	ja:"タップでパワーアップするよ",	},
	"GamePlay.Navigator.BrowAway.Start":	{	_:"Please Momoko!",	ja:"おねがい☆桃子ちゃん",	},
	"GamePlay.Navigator.BrowAway.Venus":	{	_:"Are you looking at Venus, Momoko?",	ja:"金星を見ておいでですか、桃子ちゃん",	},
	"GamePlay.Navigator.BrowAway.Mars":	{	_:"Here is a place futher than Mars.",	ja:"火星よりも遠い場所だね",	},
	"GamePlay.Navigator.BrowAway.Mercury":	{	_:"Mercury!\nI needa douse myself in water and repent.",	ja:"水星！ 水をかぶって反省しなきゃ…",	},
	"GamePlay.Navigator.BrowAway.Sun":	{	_:"Farewell, the sun!\nFrom the theater with love.",	ja:"さようなら太陽！\nシアターより愛をこめて",	},
	"GamePlay.Navigator.BrowAway.Kirari":	{	_:"Listen Momoko.\nAre you more far than Kirarin Robot?",	ja:"桃子ちゃんはきらりんロボより遠方なんですか？",	},
	"GamePlay.Navigator.Measure":	{	_:"Momoko is $0 from Earth,\nin the space.",	ja:"桃子ちゃんは地球からはるか\n$0彼方の宇宙に位置してるよ",	},
	"GamePlay.Distance.Emit":	{	_: "Meteor: $0 $1",	},

	"GamePlay.Share.Format":	{	_:"https://twitter.com/intent/tweet?text=$0%0a%23$2%0a$1",},
	"GamePlay.Share.Text":	{	_:"Momoko flew the meteorite $0 $1 away!",	ja:"桃子ちゃんは隕石を$0$1吹っ飛ばしました！",	},
	"GamePlay.Share.URL":	{	_:"https://example.jp/",},
	"GamePlay.Share.Tags":	{	_:"MeteorStrikerMomoko",	ja:"メテオストライカー桃子",	},
	


}

})();	//File Scope

var L	= new LocaleSettings();
