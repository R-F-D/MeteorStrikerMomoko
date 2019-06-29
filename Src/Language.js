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
	"Unit.Distance":	{_:"km",	}, //飛距離の単位
	"Unit.Aim":			{_:"%",	}, //エイミング倍率の単位
	"Unit.Blow":		{_:"%",	}, //打撃倍率の単位
	"Unit.Emit":		{_:"%",	}, //エミット倍率の単位

	//タイトル画面 Title
	"Title.Button.Play":		{_:"Play game",					ja:"ゲームをプレイ",	}, //プレイボタン
	"Title.Button.Records":		{_:"Records and achievements",	ja:"記録と実績",	}, //スコアボタン
	"Title.Button.Help":		{_:"How to play",				ja:"ゲームの遊び方",	}, //ヘルプボタン
	"Title.Button.Settings":	{_:"Settings",					ja:"設定",	}, //設定ボタン
	"Title.Button.WebPage":		{_:"Go to the web page",		ja:"ウェブページへ",	}, //ウェブページボタン
	"Title.Button.Credits":		{_:"Show credits",				ja:"作ったひと",	}, //クレジットボタン
	"Title.Reaction.Player":	{_:"Momoko dakedo.",			ja:"桃子だけど。",	}, //プレイヤーをクリック時

	//ゲームプレイ GamePlay
	"GamePlay.Distance":		{_:"Meteor: $0 $1",	}, //隕石の飛距離メーター

	//ナビゲータ Navigator
	"GamePlay.Navigator.Aim":				{_:"Take aim and long tap to charge.",									ja:"ねらいを定めて長押ししてね",	}, //エイミングゲージ作動中
	"GamePlay.Navigator.Preliminary":		{_:"Release to attack.",												ja:"はなすと攻撃だよ",				}, //チャージ動作中
	"GamePlay.Navigator.Fail":				{_:"Release at the right time.",										ja:"タイミングよく はなしてね",		}, //打撃失敗
	"GamePlay.Navigator.Emit":				{_:"The power rises with taps.",										ja:"タップでパワーアップするよ",	}, //エミット中
	"GamePlay.Navigator.Result.Reset":		{_:"You go back to the title screen.", 									ja:"タイトル画面にもどるよ",		}, //リセットボタン
	"GamePlay.Navigator.Result.Retry":		{_:"You play this game again.",											ja:"もういちどゲームをやるよ",		}, //リトライボタン
	"GamePlay.Navigator.Result.Share":		{_:"You post the score to Twitter.",									ja:"Twitterに結果をつぶやくよ",		}, //シェアボタン

	"GamePlay.Navigator.BrowAway.Start":	{_:"Please Momoko!",													ja:"おねがい☆桃子ちゃん",							}, //吹き飛ばし開始（おねがいティーチャー）
	"GamePlay.Navigator.BrowAway.Venus":	{_:"Are you looking at Venus, Momoko?",									ja:"金星を見ておいでですか、桃子ちゃん",			}, //金星通過（銀英伝）
	"GamePlay.Navigator.BrowAway.Mars":		{_:"Here is a place futher than Mars.",									ja:"火星よりも遠い場所だね",						}, //火星通過（宇宙よりも遠い場所）
	"GamePlay.Navigator.BrowAway.Mercury":	{_:"I needa douse myself in water and repent.",							ja:"水をかぶって反省しなきゃ…",						}, //水星通過（セーラームーン マーキュリー）
	"GamePlay.Navigator.BrowAway.Sun":		{_:"Farewell, the sun!\nFrom the theater with love.",					ja:"さようなら太陽！\nシアターより愛をこめて",		}, //太陽通過（宇宙戦艦ヤマト#10）
	"GamePlay.Navigator.BrowAway.Kirari":	{_:"Listen Momoko.\nAre you more far than Kirarin Robot?",				ja:"桃子ちゃんはきらりんロボより遠方なんですか？",	}, //きらりんロボ通過（ガンダム 人間よりMSが大切なんですか）
	"GamePlay.Navigator.BrowAway.Unicorn":	{_:"I see them! I can see a pink unicorn!",								ja:"みえるよ！ わたしにもピンクのユニコーンがみえる！",	}, //2.5億km到達（ガンダム）
	"GamePlay.Navigator.Leave":				{_:"Momoko arrived at the Large Million Space\n$0 away from the Earth.",ja:"桃子ちゃんは、地球から$0の\n彼方にある大ミリオン宇宙へ、いま到達したよ",	}, //結果表示（ヤマト OPナレ）


	//記録 Records
	"Records.GamePlay.HighScore":							{_:"High Score",				ja:"ハイスコア",	}, //
	"Records.GamePlay.HighScore.Format":					{_:"$0$1",	}, //
	"Records.GamePlay.NumGoods":							{_:"Aimings of Good or Over",	ja:"グッド以上",	}, //
	"Records.GamePlay.NumGoods.Format":						{_:"$0",						ja:"$0回",	}, //
	"Records.GamePlay.NumPerfects":							{_:"Aimings of Perfect",		ja:"パーフェクト",	}, //
	"Records.GamePlay.NumPerfects.Format":					{_:"$0",						ja:"$0回",	}, //
	"Records.GamePlay.NumTruePerfects":						{_:"Aimings of 100%",			ja:"100%パーフェクト",	}, //
	"Records.GamePlay.NumTruePerfects.Format":				{_:"$0",						ja:"$0回",	}, //
	"Records.GamePlay.BestAiming":							{_:"Best Aiming Rate",			ja:"エイミング最高倍率",	}, //
	"Records.GamePlay.BestAiming.Format":					{_:"$0$1",	}, //
	"Records.GamePlay.NumHardBlowings":						{_:"Hardblows",					ja:"強打",	}, //
	"Records.GamePlay.NumHardBlowings.Format":				{_:"$0",						ja:"$0回",	}, //
	"Records.GamePlay.NumLightBlowings":					{_:"Ligheblows",				ja:"軽打",	}, //
	"Records.GamePlay.NumLightBlowings.Format":				{_:"$0",						ja:"$0回",	}, //
	"Records.GamePlay.BestBlowing":							{_:"Best Blowing Rate",			ja:"打撃最高倍率",	}, //
	"Records.GamePlay.BestBlowing.Format":					{_:"$0$1",	}, //
	"Records.GamePlay.NumHardAndPerfectBlowings":			{_:"Hardblow And Perfect",		ja:"強打＆パーフェクト",	}, //
	"Records.GamePlay.NumHardAndPerfectBlowings.Format":	{_:"$0",						ja:"$0回",	}, //
	"Records.GamePlay.MaxSuccessiveusHits":					{_:"Max Successiveus Hits",		ja:"連続ヒット",	}, //
	"Records.GamePlay.MaxSuccessiveusHits.Format":			{_:"$0",						ja:"$0回",	}, //
	"Records.GamePlay.MaxEmittings":						{_:"Max Emitting Rate",			ja:"エミット最高倍率",	}, //
	"Records.GamePlay.MaxEmittings.Format":					{_:"$0$1",	}, //
	"Records.Action.NumPlayings":							{_:"Playings",					ja:"プレイ回数",	}, //
	"Records.Action.NumPlayings.Format":					{_:"$0",						ja:"$0回",	}, //

	//シェア Share
	"GamePlay.Share.Format":	{_:"https://twitter.com/intent/tweet?text=$0%0a%23$2%0a$1",	}, //Twitter Intent
	"GamePlay.Share.Text":		{_:"Momoko flew the meteorite $0 $1 away!",					ja:"桃子ちゃんは隕石を$1$2吹っ飛ばしました！",	}, //ツイート文字列
	"GamePlay.Share.URL":		{_:"https://example.jp/",	}, //URL
	"GamePlay.Share.Tags":		{_:"MeteorStrikerMomoko",									ja:"メテオストライカー桃子",	}, //タグ

	//実績 Achievement
	"Achievement.Unlocked" :	{_:"Achievement Unlocked!!",	ja:"実績解除!",	}, //実績解除ラベル

	"Achievement.Aiming.ManyPerfect":			{_:"Perfect Sun",								ja:"パーフェクトサン",				}, //パーフェクト一定回数（パーフェクトサン）
	"Achievement.Aiming.ManyPerfect.Text":		{_:"Got $0 perfect aims.",						ja:"$0回パーフェクトを出した",		},
	"Achievement.Aiming.ManyGood":				{_:"Good-Aims, Baby",																}, //グッド以上を一定回数（Good-Sleep,Baby）
	"Achievement.Aiming.ManyGood.Text":			{_:"Got $0 good or better aims",				ja:"$0回グッド以上を出した",		},
	"Achievement.Aiming.TruePerfect":			{_:"Self-Styled Perfect",						ja:"自称・カンペキ",				}, //100%エイム（自称カンペキ）
	"Achievement.Aiming.TruePerfect.Text":		{_:"Succeeded in 100% aim.",					ja:"100%エイムに成功した",			},
	"Achievement.Blowing.ManyHard":				{_:"ART NEEDS HARD-BLOWS",															}, //強打を一定回数（ART NEEDS HAERT BEATS）
	"Achievement.Blowing.ManyHard.Text":		{_:"Hardblowed $0 times.",						ja:"$0回強打した",					},
	"Achievement.Blowing.HardAndPerfect":		{_:"Perfect Hard☆",								ja:"パーフェクトっすハード☆",	  }, //強打かつパーフェクト（しゅがーはぁとレボリューション）
	"Achievement.Blowing.HardAndPerfect.Text":	{_:"Hardblowed with a perfect aim.",			ja:"強打でパーフェクトを出した",	},
	"Achievement.Blowing.SuccessiveHits":		{_:"Into Perpetual Hit Machines, L'Antica!",	ja:"永久ヒットにしてゆくよ 安定化!",}, //打撃を連続成功（バベルシティグレイス）
	"Achievement.Blowing.SuccessiveHits.Text":	{_:"Hit $0 times in a row without failure.",	ja:"失敗せず$0回連続でヒットさせた",},
	"Achievement.Emit.Many01":					{_:"Gentle Emt",								ja:"Gentleエミット",				}, //エミット回数実績その1（オーバーマスター）
	"Achievement.Emit.Many01.Text":				{_:"Emitted $0$1 and more.",					ja:"エミット倍率$0$1以上を出した",	},
	"Achievement.Emit.Many02":					{_:"Wild Emit",									ja:"Wildエミット",					}, //エミット回数実績その2（オーバーマスター）
	"Achievement.Emit.Many02.Text":				{_:"Emitted $0$1 and more.",					ja:"エミット倍率$0$1以上を出した",	},
	"Achievement.Emit.Many03":					{_:"Dangerous Emit",							ja:"Dangerousエミット",				}, //エミット回数実績その3（オーバーマスター）
	"Achievement.Emit.Many03.Text":				{_:"Emitted $0$1 and more.",					ja:"エミット倍率$0$1以上を出した",	},
	"Achievement.Emit.Many04":					{_:"Over-emit",									ja:"オーバーエミット",				}, //エミット回数実績その4（オーバーマスター）
	"Achievement.Emit.Many04.Text":				{_:"Emitted $0$1 and more.",					ja:"エミット倍率$0$1以上を出した",	},

	"Achievement.Check.Venus":					{_:"Do You Know Venus?",															}, //金星到達（ヴィーナスシンドローム）
	"Achievement.Check.Venus.Text":				{_:"Flew the meteorite over $1$2.",				ja:"隕石を$1$2以上吹っ飛ばした",	},
	"Achievement.Check.Mars":					{_:"Beyond The Mars",							ja:"ビヨンドザマーズ",				}, //火星到達（ビヨンドザスターズ）
	"Achievement.Check.Mars.Text":				{_:"Flew the meteorite over $1$2.",				ja:"隕石を$1$2以上吹っ飛ばした",	},
	"Achievement.Check.Mercury":				{_:"Go Straight Ahead, Cross Over Mercury", 	ja:"進めまっすぐ 水星越えて",		}, //水星到達（Beyond The Dream）
	"Achievement.Check.Mercury.Text":			{_:"Flew the meteorite over $1$2.",				ja:"隕石を$1$2以上吹っ飛ばした",	},
	"Achievement.Check.Sun":					{_:"BEYOND THE SUNLIGHT",															}, //太陽到達（BEYOND THE STARLIGHT）
	"Achievement.Check.Sun.Text":				{_:"Flew the meteorite over $1$2.",				ja:"隕石を$1$2以上吹っ飛ばした",	},
	"Achievement.Check.Kirari":					{_:"Kirari, Passed Through The Row of Light",	ja:"キラリ 光の列すり抜けたら",		}, //諸星きらり到達（Kosmos,Cosmos）
	"Achievement.Check.Kirari.Text":			{_:"Flew the meteorite over $1$2.",				ja:"隕石を$1$2以上吹っ飛ばした",	},
	"Achievement.Check.Unicorn":				{_:"Tell Me the Pink Unicorn...",				ja:"教えてpink unicorn...",			}, //2.5億km到達（教え絵last note...）
	"Achievement.Check.Unicorn.Text":			{_:"Flew the meteorite over $1$2.",				ja:"隕石を$1$2以上吹っ飛ばした",	},

	"Achievement.Action.FirstPlay":				{_:"For Save The Earch Crisis",					ja:"地球の危機を救うため",			}, //初プレイ（地球の危機を救うため 周防桃子）
	"Achievement.Action.FirstPlay.Text":		{_:"Stopped the meteorite and saved the Earch.",ja:"隕石を食い止めて世界を救った",	},
	"Achievement.Action.Share":					{_:"Shared Your Result",						ja:"結果をシェアして",				}, //結果シェア（ドレミファクトリー！）
	"Achievement.Action.Share.Text":			{_:"We post $0 tweets.",						ja:"ツイート✕$0投稿するんだ",		},
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
};


})();	//File Scope

var L	= (new LocaleSettings()).Load().Save();
