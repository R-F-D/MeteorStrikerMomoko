/* *******************************************************************************
	地域設定
********************************************************************************/
var LocaleSetting	= LocaleSetting | {};
(function(){	//File Scope

/**地域設定クラス*/
LocaleSetting	= class LocaleSettings{
	constructor(){

		/**テキストの言語*/
		this.language			= 'ja';
		/**数値の区切り方法*/
		this.numericSeparation	= 'JP';

		if(!NumericSeparators[this.numericSeparation])	this.numericSeparation	= '_default';
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



