/********************************************************************************
	地域設定
********************************************************************************/

/********************************************************************************
 * 数値の区切り
 * Hash of Numeric Separations
 *******************************************************************************/
const NumericSeparators	= {
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
 * ローカライズされたテキストの一覧
 * Hash of Localized Texts
 *******************************************************************************/
const LocalizedTexts	= {
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
};

