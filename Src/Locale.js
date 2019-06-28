/********************************************************************************
	地域設定
********************************************************************************/
var LocaleSetting	= LocaleSetting | {};
(function(){	//File Scope

/********************************************************************************
 * 数値の区切り
 *******************************************************************************/
NumericSeparators	= {
	//国際度量衡総会 General Conference on Weights and Measures
	_:{
		nDigits:	3,	//何桁ごとに区切るか How many every digits
		integer:	' ',	//整数の区切り Integer separator
		//integer:	["T","M","B"],	//	整数の区切りが毎回異なるなら配列に If the separators are different, set an array
		decimal:	'.',	//小数点 Decimal separator
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
	//単位 Unit
	"GamePlay.Distance.Unit":	{	_: "km",	}, //飛距離の単位
	"GamePlay.Emitting.Unit":	{	_: "%",	}, //エミット倍率の単位

	//タイトル画面 Title
	"Title.Button.Play":	{	_:"Play game",	ja:"ゲームをプレイ",	}, //プレイボタン
	"Title.Button.Records":	{	_:"Records and achievements",	ja:"記録と実績",	}, //スコアボタン
	"Title.Button.Help":	{	_:"How to play",	ja:"ゲームの遊び方",	}, //ヘルプボタン
	"Title.Button.Settings":	{	_:"Settings",	ja:"設定",	}, //設定ボタン
	"Title.Button.WebPage":	{	_:"Go to the web page",	ja:"ウェブページへ",	}, //ウェブページボタン
	"Title.Button.Credits":	{	_:"Show credits",	ja:"作ったひと",	}, //クレジットボタン
	"Title.Reaction.Player":	{	_:"Momoko dakedo.",	ja:"桃子だけど。",	}, //プレイヤーをクリック時

	//ゲームプレイ GamePlay
	"GamePlay.Distance":	{	_: "Meteor: $0 $1",	}, //隕石の飛距離メーター

	//ナビゲータ Navigator
	"GamePlay.Navigator.Aim":	{	_:"Take aim and long tap to charge.",	ja:"ねらいを定めて長押ししてね",	}, //エイミングゲージ作動中
	"GamePlay.Navigator.Preliminary":	{	_:"Release to attack.",	ja:"はなすと攻撃だよ",	}, //チャージ動作中
	"GamePlay.Navigator.Fail":	{	_:"Release at the right time.",	ja:"タイミングよく はなしてね",	}, //打撃失敗
	"GamePlay.Navigator.Emit":	{	_:"The power rises with taps.",	ja:"タップでパワーアップするよ",	}, //エミット中
	"GamePlay.Navigator.BrowAway.Start":	{	_:"Please Momoko!",	ja:"おねがい☆桃子ちゃん",	}, //吹き飛ばし開始
	"GamePlay.Navigator.BrowAway.Venus":	{	_:"Are you looking at Venus, Momoko?",	ja:"金星を見ておいでですか、桃子ちゃん",	}, //金星通過
	"GamePlay.Navigator.BrowAway.Mars":	{	_:"Here is a place futher than Mars.",	ja:"火星よりも遠い場所だね",	}, //火星通過
	"GamePlay.Navigator.BrowAway.Mercury":	{	_:"I needa douse myself in water and repent.",	ja:"水をかぶって反省しなきゃ…",	}, //水星通過
	"GamePlay.Navigator.BrowAway.Sun":	{	_:"Farewell, the sun!\nFrom the theater with love.",	ja:"さようなら太陽！\nシアターより愛をこめて",	}, //太陽通過
	"GamePlay.Navigator.BrowAway.Kirari":	{	_:"Listen Momoko.\nAre you more far than Kirarin Robot?",	ja:"桃子ちゃんはきらりんロボより遠方なんですか？",	}, //きらりんロボ通過
	"GamePlay.Navigator.BrowAway.Unicorn":	{	_:"I see them! I can see a pink unicorn!",	ja:"みえる！ わたしにもピンクのユニコーンがみえるよ！",	}, //2.5億km到達
	"GamePlay.Navigator.Leave":	{	_:"Momoko arrived at the Large Million Space\n$0 away from the Earth.",	ja:"桃子ちゃんは、地球から$0の\n彼方にある大ミリオン宇宙へ、いま到達したよ",	}, //結果表示
	"GamePlay.Navigator.Result.Reset":	{	_:"You go back to the title screen.", ja:"タイトル画面にもどるよ",	}, //リセットボタン
	"GamePlay.Navigator.Result.Retry":	{	_:"You play this game again.",	ja:"もういちどゲームをやるよ",	}, //リトライボタン
	"GamePlay.Navigator.Result.Share":	{	_:"You post the score to Twitter.",	ja:"Twitterに結果をつぶやくよ",	}, //シェアボタン

	"Records.GamePlay.HighScore":					{	_:"High Score",	ja:"ハイスコア",	}, //
	"Records.GamePlay.NumGoods":					{	_:"Aimings of Good or Over",	ja:"グッド以上",	}, //
	"Records.GamePlay.NumPerfects":					{	_:"Aimings of Perfect",	ja:"パーフェクト",	}, //
	"Records.GamePlay.NumTruePerfects":				{	_:"Aimings of 100%",	ja:"100%パーフェクト",	}, //
	"Records.GamePlay.BestAiming":					{	_:"Best Aiming Rate",	ja:"エイミング最高倍率",	}, //
	"Records.GamePlay.NumHardBlowings":				{	_:"Hardblows",	ja:"強打",	}, //
	"Records.GamePlay.NumLightBlowings":			{	_:"Ligheblows",	ja:"軽打",	}, //
	"Records.GamePlay.BestBlowing":					{	_:"Best Blowing Rate",	ja:"打撃最高倍率",	}, //
	"Records.GamePlay.NumHardAndPerfectBlowings":	{	_:"Hardblow And Perfect",	ja:"強打＆パーフェクト",	}, //
	"Records.GamePlay.MaxSuccessiveusHits":			{	_:"Max Successiveus Hits",	ja:"連続ヒット",	}, //
	"Records.GamePlay.MaxEmittings":				{	_:"Max Emitting Rate",	ja:"エミット最高倍率",	}, //
	"Records.Action.NumPlayings":					{	_:"Playings",	ja:"プレイ回数",	}, //

	//シェア Share
	"GamePlay.Share.Format":	{	_:"https://twitter.com/intent/tweet?text=$0%0a%23$2%0a$1",	}, //Twitter Intent
	"GamePlay.Share.Text":	{	_:"Momoko flew the meteorite $0 $1 away!",	ja:"桃子ちゃんは隕石を$1$2吹っ飛ばしました！",	}, //ツイート文字列
	"GamePlay.Share.URL":	{	_:"https://example.jp/",	}, //URL
	"GamePlay.Share.Tags":	{	_:"MeteorStrikerMomoko",	ja:"メテオストライカー桃子",	}, //タグ

	//実績 Achievement
	"Achievement.Unlocked" :	{	_:"Achievement Unlocked!!",	ja:"実績解除!",	}, //実績解除ラベル

	"Achievement.Aiming.ManyPerfect.Title":	{	_:"Perfect Sun",	ja:"パーフェクトサン",	}, //パーフェクト一定回数
	"Achievement.Aiming.ManyPerfect.Description":	{	_:"Got $0 perfect aims.",	ja:"$0回パーフェクトを出した",	},
	"Achievement.Aiming.ManyGood.Title":	{	_:"Good-Aims, Baby",	}, //グッド以上を一定回数
	"Achievement.Aiming.ManyGood.Description":	{	_:"Got $0 good or better aims",	ja:"$0回グッド以上を出した",	}, //
	"Achievement.Aiming.TruePerfect.Title":	{	_:"Self-Styled Perfect",	ja:"自称・カンペキ",	}, //100%エイム
	"Achievement.Aiming.TruePerfect.Description":	{	_:"Succeeded in 100% aim.",	ja:"100%エイムに成功した",	}, //
	"Achievement.Blowing.ManyHard.Title":	{	_:"ART NEEDS HARD-BLOWS",	}, //強打を一定回数
	"Achievement.Blowing.ManyHard.Description":	{	_:"Hardblowed $0 times.",	ja:"$0回強打した",	}, //
	"Achievement.Blowing.HardAndPerfect.Title":	{	_:"Perfect Hard☆",	ja:"パーフェクトっすハード☆",	}, //強打かつパーフェクト
	"Achievement.Blowing.HardAndPerfect.Description":	{	_:"Hardblowed with a perfect aim.",	ja:"強打でパーフェクトを出した",	}, //
	"Achievement.Blowing.SuccessiveHits.Title":	{	_:"Into Perpetual Hit Machines, L'Antica!",	ja:" 永久ヒットにしてゆくよ \"安定化!\"",	}, //打撃を連続成功
	"Achievement.Blowing.SuccessiveHits.Description":	{	_:"Hit $0 times in a row without failure.",	ja:"失敗せずに$0回連続で打撃をヒットさせた",	}, //
	"Achievement.Emit.Many01.Title":	{	_:"Gentle Emt",	}, //エミット回数実績その1
	"Achievement.Emit.Many01.Description":	{	_:"Emitted $0$1 and more.",	ja:"エミット率$0$1以上を出した",},
	"Achievement.Emit.Many02.Title":	{	_:"Wild Emit",	}, //エミット回数実績その2
	"Achievement.Emit.Many02.Description":	{	_:"Emitted $0$1 and more.",	ja:"エミット率$0$1以上を出した",},
	"Achievement.Emit.Many03.Title":	{	_:"Dangerous Emit",	}, //エミット回数実績その3
	"Achievement.Emit.Many03.Description":	{	_:"Emitted $0$1 and more.",	ja:"エミット率$0$1以上を出した",},
	"Achievement.Emit.Many04.Title":	{	_:"Over-emit",	ja:"オーバーエミット",	}, //エミット回数実績その4
	"Achievement.Emit.Many04.Description":	{	_:"Emitted $0$1 and more.",	ja:"エミット率$0$1以上を出した",},

	"Achievement.Check.Venus.Title":	{	_:"Do You Know Venus?",	}, //金星到達
	"Achievement.Check.Venus.Description":	{	_:"Flew the meteorite over $1$2.",	ja:"隕石を$1$2以上吹っ飛ばした",	}, //
	"Achievement.Check.Mars.Title":	{	_:"Beyond The Mars",	ja:"ビヨンドザマーズ",	}, //火星到達
	"Achievement.Check.Mars.Description":	{	_:"Flew the meteorite over $1$2.",	ja:"隕石を$1$2以上吹っ飛ばした",	}, //
	"Achievement.Check.Mercury.Title":	{	_:"Go Straight Ahead, Cross Over Mercury", ja:"まっすぐ進め 水星越えて",	}, //水星到達
	"Achievement.Check.Mercury.Description":	{	_:"Flew the meteorite over $1$2.",	ja:"隕石を$1$2以上吹っ飛ばした",	}, //
	"Achievement.Check.Sun.Title"	:	{	_:"BEYOND THE SUNLIGHT",	}, //太陽到達
	"Achievement.Check.Sun.Description"	:	{	_:"Flew the meteorite over $1$2.",	ja:"隕石を$1$2以上吹っ飛ばした",	}, //
	"Achievement.Check.Kirari.Title":	{	_:"Kirari, The Row of Light",	ja:"キラリ 光の列",	}, //諸星きらり到達
	"Achievement.Check.Kirari.Description":	{	_:"Flew the meteorite over $1$2.",	ja:"隕石を$1$2以上吹っ飛ばした",	}, //
	"Achievement.Check.Unicorn.Title":	{	_:"Tell Me the Pink Unicorn...",	ja:"教えてpink unicorn...",	}, //2.5億km到達
	"Achievement.Check.Unicorn.Description":	{	_:"Flew the meteorite over $1$2.",	ja:"隕石を$1$2以上吹っ飛ばした",	}, //

	"Achievement.Action.FirstPlay.Title" :	{	_:"For Save The Earch Crisis",	ja:"地球の危機を救うため",	}, //初プレイ
	"Achievement.Action.FirstPlay.Description" :	{	_:"Stopped the meteorite and saved the Earch.",	ja:"隕石を食い止めて世界を救った",	}, //
	"Achievement.Action.Share.Title" :	{	_:"Shared Your Result",	ja:"結果をシェアして",	}, //結果シェア
	"Achievement.Action.Share.Description" :	{	_:"We post $0 tweets.",	ja:"ツイート✕$0投稿するんだ",	}, //
}



/**地域設定クラス*/
LocaleSettings	= class{

	constructor(){

		/** @const グローバルの言語コード  */
		this.GLOBAL_CODE		= "_";

		/**テキストの言語*/
		this.language			= this.GLOBAL_CODE;
		/**数値の区切り方法*/
		this.numericSeparation	= this.GLOBAL_CODE;
	}

	/** 言語コードをセットする
	 * @param {string} langCode
	 */
	SetLanguage(langCode=this.GLOBAL_CODE){
		this.language	= langCode;
		return this;
	}
	/** 設定されている言語コードを取得 */
	GetLanguageCode(){return this.language};

	/** 数字区切りの言語をセットする
	 * @param {string} langCode
	 */
	SetNumberSeparation(langCode=this.GLOBAL_CODE){
		this.numericSeparation	= langCode;
		if(!NumericSeparators[this.numericSeparation])	this.numericSeparation	= this.GLOBAL_CODE;
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

	/** 識別子に対応するテキストが存在するか
	 * @param {string} textCode		テキスト識別子
	 * @param {string} [lang=null]	言語。省略時は言語を問わない
	 * @returns
	 */
	TextExists(textCode,lang=null){
		if(lang)return !!(Texts[textCode] && Texts[textCode][lang]);
		else	return !!Texts[textCode];
	}


	/** 数値に区切り文字を挿入
	 * @param {number} value		整数
	 * @param {number?} [nDecimalDigits=0] 小数点以下の桁数
	 * @param {string?} [lang=null]	言語。省略時はすでに設定されている言語。
	 * @returns {string}
	 */
	NumToStr(value,nDecimalDigits=0, lang=null){
		const separation	= NumericSeparators[lang||this.numericSeparation] || NumericSeparators["_"];

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
};


})();	//File Scope

var L	= (new LocaleSettings()).SetLanguage("ja").SetNumberSeparation("ja");
