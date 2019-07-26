/********************************************************************************
	 地域別のテキストと数値区切り設定
	 Text And Number Separaotors
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

	//----------------------------------------
	// 単位
	// Unit
	//----------------------------------------
		"Unit.Distance":{_:"km",},				//飛距離の単位 Distance
		"Unit.Aim":		{_:"%", },				//エイミング精度の単位 Aim
		"Unit.Blow":	{_:"%", },				//打撃倍率の単位 Charge
		"Unit.Emit":	{_:"%", },				//エミット倍率の単位 Emit
		"Unit.Counter":	{_:"$0", ja:"$0回",	},	//Records>カウンタの単位（デフォルト） Records > Counter(Default)

	//----------------------------------------
	// タイトル画面
	// Title Scene
	//----------------------------------------

		//プレイボタン Play Button
		"Title.Button.Play":{
			_:	"Play game",
			ja:	"ゲームをプレイ",
		},

		//実績ボタン Achievements Button
		"Title.Button.Achievements":{
			_:	"Achievements",
			ja:	"実績",
		},

		//レコードボタン Records Button
		"Title.Button.Records":{
			_:	"Records",
			ja:	"記録",
		},

		//ヘルプボタン Help Button
		"Title.Button.Help":{
			_:	"How to play",
			ja:	"ゲームの遊び方",
		},

		//設定ボタン Settings Button
		"Title.Button.Settings":{
			_:	"Settings",
			ja:	"設定",
		},

		//クレジットボタン Credits Button
		"Title.Button.Credits":{
			_:	"Show credits",
			ja:	"作ったひと",
		},

		//プレイヤーをクリック時 On Click The Player
		"Title.Reaction.Player":{
			_:	"Momoko dakedo.",
			ja:	"桃子だけど。",
		},


	//----------------------------------------
	// ゲームプレイ画面
	// GamePlay Scene
	//----------------------------------------

		//隕石の飛距離メーター Distance Meter
		"GamePlay.Distance":{
			_:	"Meteor: $0 $1",
		},


	//----------------------------------------
	// ゲームプレイ - ナビゲータのメッセージ
	// GamePlay - Navigator's Messages
	//----------------------------------------

		//エイミングバー作動中 Booting Aim Bar
		"GamePlay.Navigator.Aim":{
			_:	"Take aim and long tap to charge.",
			ja:	"ねらいを定めて長押ししてね",
		},

		//チャージ動作中 Charging
		"GamePlay.Navigator.Preliminary":{
			_:	"Release to attack.",
			ja:	"はなすと攻撃だよ",
		},

		//打撃失敗 Failed to Blow
		"GamePlay.Navigator.Fail":{
			_:	"Release at the right time.",
			ja:	"タイミングよく はなしてね",
		},

		//エミット中 Emitting
		"GamePlay.Navigator.Emit":{
			_:	"The power rises with taps.",
			ja:	"タップでパワーアップするよ",
		},

		//結果表示 Result
		"GamePlay.Navigator.Leave":{
			_:	"Momoko arrived at the Large Million Space\n$0 away from the Earth.",
			ja:	"桃子ちゃんは、地球から$0の\n彼方にある大ミリオン宇宙へ、いま到達したよ",	//宇宙戦艦ヤマト OPナレーション
		},

		//リセットボタン説明 Reset Button
		"GamePlay.Navigator.Result.Reset":{
			_:	"You go back to the title screen.",
			ja:	"タイトル画面にもどるよ",
		},

		//リトライボタン説明 Retry Button
		"GamePlay.Navigator.Result.Retry":{
			_:	"You play this game again.",
			ja:	"もういちどゲームをやるよ",
		},

		//シェアボタン説明 Share Button
		"GamePlay.Navigator.Result.Share":{
			_:	"You post the score to Twitter.",
			ja:	"Twitterに結果をつぶやくよ",
		},

		//チェックポイント：開始 Check Point : Start
		"GamePlay.Navigator.BrowAway.Start":{
			_:	"Please Momoko!",
			ja:	"おねがい☆桃子ちゃん",	//おねがいティーチャー
		},

		//チェックポイント：金星 Check Point : Venus
		"GamePlay.Navigator.BrowAway.Venus":{
			_:	"Are you looking at Venus, Momoko?",
			ja:	"金星を見ておいでですか、桃子ちゃん",	//銀河英雄伝説#01
		},

		//チェックポイント：火星 Check Point : Mars
		"GamePlay.Navigator.BrowAway.Mars":{
			_:	"Here is a place futher than Mars.",
			ja:	"火星よりも遠い場所だブーストがね",	//宇宙よりも遠い場所
		},

		//チェックポイント：水星 Check Point : Mercury
		"GamePlay.Navigator.BrowAway.Mercury":{
			_:	"I needa douse myself in water and repent.",
			ja:	"水をかぶって反省しなきゃ…",	//セーラームーン マーキュリー
		},

		//チェックポイント：太陽 Check Point : Sun
		"GamePlay.Navigator.BrowAway.Sun":{
			_:	"Farewell, the sun!\nFrom the theater with love.",
			ja:	"さようなら太陽！\nシアターより愛をこめて",	//宇宙戦艦ヤマト#10
		},

		//チェックポイント：きらりんロボ通過 Check Point : Kirarin Robot
		"GamePlay.Navigator.BrowAway.Kirari":{
			_:	"Listen Momoko.\nAre you more far than Kirarin Robot?",
			ja:	"桃子ちゃんはきらりんロボより遠方なんですか？",	//機動戦士ガンダム 台詞「人間よりMSが大切なんですか」
		},

		//チェックポイント：最終 Check Point : Last
		//	（ガンダム）
		"GamePlay.Navigator.BrowAway.Unicorn":{
			_:	"I see them! I can see a pink unicorn!",
			ja:	"みえるよ！ わたしにもピンクのユニコーンがみえる！",
		},


	//----------------------------------------
	// レコード画面 - 記録
	// Records Scene - Records
	//
	//	XXX			: 項目名
	//	XXX.Format	: カウンタ表示
	//----------------------------------------

		//シークレット項目 Secret
		"Records.Secret":{
			_:	"??????????",
			ja:	"？？？？？",
		},
		"Records.Secret.Format":{
			_:	"???",
		},

		//ハイスコア High Score
		"Records.GamePlay.HighScore":{
			_:	"High Score",
			ja:	"ハイスコア",
		},
		"Records.GamePlay.HighScore.Format":{
			_:	"$0$1",
		},

		//直近の平均飛距離
		"Records.GamePlay.MeanDistance":{
			_:	"Latest Mean Distance",
			ja:	"直近の平均飛距離",
		},
		"Records.GamePlay.MeanDistance.Format":{
			_:	"$0$1",
		},

		//チェックポイント通過回数
		"Records.GamePlay.NumPassings.00":{
			_:	"Arrivals at the Sun",
			ja:	"太陽到達回数",
		},
		"Records.GamePlay.NumPassings.00.Secret":{
			_:	"Arrivals at ????????",
			ja:	"？？？？到達回数",
		},
		"Records.GamePlay.NumPassings.01":{
			_:	"Kirarin Robot Passings",
			ja:	"きらりんロボ通過回数",
		},
		"Records.GamePlay.NumPassings.01.Secret":{
			_:	"???????? Passings",
			ja:	"？？？？通過回数",
		},
		"Records.GamePlay.NumPassings.02":{
			_:	"Found Pink Unicorns",
			ja:	"ピンクのユニコーン発見数",
		},
		"Records.GamePlay.NumPassings.02.Secret":{
			_:	"Found ????????",
			ja:	"？？？？発見数",
		},
		"Records.GamePlay.NumPassings.02.Format":{
			_:	"$0",
			ja:	"$0匹",
		},

		//グッド以上の回数 Good/Perfect Aims
		"Records.GamePlay.NumGoods":{
			_:	"Good Aims",
			ja:	"グッドエイム",
		},

		//パーフェクト回数 Perfect Aims
		"Records.GamePlay.NumPerfects":{
			_:	"Perfect Aims",
			ja:	"パーフェクトエイム",
		},

		//100%エイム回数 100% Aims
		"Records.GamePlay.NumTruePerfects":{
			_:	"100% Perfect Aims",
			ja:	"100%パーフェクトエイム",
		},

		//最高エイミング精度 Best Aiming Accurasy
		"Records.GamePlay.BestAiming":{
			_:	"Best Aiming Accurasy",
			ja:	"最高エイミング精度",
		},
		"Records.GamePlay.BestAiming.Format":{
			_:	"$0$1",
		},

		//直近の平均エイミング精度 Latest Mean Aiming Accurasy
		"Records.GamePlay.MeanAiming":{
			_:	"Latest Mean Aiming Accuracy",
			ja:	"直近の平均エイミング精度",
		},
		"Records.GamePlay.MeanAiming.Format":{
			_:	"$0$1",
		},

		//強打回数 Hardblows
		"Records.GamePlay.NumHardBlowings":{
			_:	"Hardblows",
			ja:	"強打",
		},

		//全力打撃回数 Full Power Blows
		"Records.GamePlay.NumFullPowerBlowings":{
			_:	"Full Power Blows",
			ja:	"全力打撃",
		},

		//強打とパーフェクトを同時に出した回数 Hardblow and Perfect
		"Records.GamePlay.NumHardAndPerfectBlowings":{
			_:	"Hardblow And Perfect",
			ja:	"強打＆パーフェクト",
		},

		//打撃最高倍率 Best Blowing Rate
		"Records.GamePlay.BestBlowing":{
			_:	"Best Blowing Rate",
			ja:	"最高打撃倍率",
		},
		"Records.GamePlay.BestBlowing.Format":{
			_:	"$0$1",
		},

		//直近の平均打撃倍率 Latest Mean Blowing Rate
		"Records.GamePlay.MeanBlowing":{
			_:	"Latest Mean Blowing Rate",
			ja:	"直近の平均打撃倍率",
		},
		"Records.GamePlay.MeanBlowing.Format":{
			_:	"$0$1",
		},

		//失敗せずに連続して打撃を成功させた数 Hits in a Row Without Failure.",
		"Records.GamePlay.MaxSuccessiveHits":{
			_:	"Max Successive Hits",
			ja:	"最大連続ヒット",
		},

		//エミット最高倍率 Best Emitting Rate
		"Records.GamePlay.MaxEmittings":{
			_:	"Max Emitting Rate",
			ja:	"最高エミット倍率",
		},
		"Records.GamePlay.MaxEmittings.Format":{
			_:	"$0$1",
		},

		//直近の平均エミット倍率 Latest Mean Emitting Rate
		"Records.GamePlay.MeanEmitting":{
			_:	"Latest Mean Emitting Rate",
			ja:	"直近の平均エミット倍率",
		},
		"Records.GamePlay.MeanEmitting.Format":{
			_:	"$0$1",
		},

		//プレイ回数 Number of Plays
		"Records.Action.NumPlays":{
			_:	"Clears",
			ja:	"クリア回数",
		},

		//起動回数 Number of Bootings
		"Records.Action.NumBootings":{
			_:	"Bootings",
			ja:	"起動回数",
		},

		//推定実行時間 Estimated Run Time
		"Records.Action.RunTime":{
			_:	"Run Time",
			ja:	"起動時間",
		},
		"Records.Action.RunTime.Format":{
			_:	"$0",
		},

		//推定合計実行時間 Estimated Total Run Time
		"Records.Action.TotalRunTime":{
			_:	"Total Run Time",
			ja:	"合計起動時間",
		},
		"Records.Action.TotalRunTime.Format":{
			_:	"$0",
		},

		//リトライ回数 Number of Retrys
		"Records.Action.NumRetrys":{
			_:	"Retrys",
			ja:	"リトライ回数",
		},

		//シェア回数 Number of Shares
		"Records.Action.NumShares":{
			_:	"Shares",
			ja:	"シェア回数",
		},

		//実績解除数 Number of Unlocked Achievements
		"Records.Action.NumUnlockedAchievements":{
			_:	"Unlocked Achievements",
			ja:	"解除した実績数",
		},
		"Records.Action.NumUnlockedAchievements.Format":{
			_:	"$0",
			ja:	"$0個",
		},

		//各ナビゲーション回数 Number of Navigates
		"Records.Action.NumNavigates.00":{
			_:	"Iku Navigates",
			ja:	"育のナビ回数",
		},
		"Records.Action.NumNavigates.00.Secret":{
			_:	"???????? Navigates",
			ja:	"？？？？のナビ回数",
		},
		"Records.Action.NumNavigates.01":{
			_:	"First Friend Navigates",
			ja:	"初めてのともだちのナビ回数",
		},
		"Records.Action.NumNavigates.01.Secret":{
			_:	"???????? Navigates",
			ja:	"？？？？のナビ回数",
		},

		//プレイヤーキャラクターをタッチした回数 Number of Touches Player Character
		"Records.Action.NumTouchesPlayer":{
			_:	"Touches Momoko",
			ja:	"桃子にタッチした回数",
		},

		//----------------------------------------
	// シェア Share
	//----------------------------------------

		//Twitter Intent
		"GamePlay.Share.Format":{
			_:	"https://twitter.com/intent/tweet?text=$0%0a%23$2%0a$1",
		},

		//ツイート文字列 Tweet Text
		"GamePlay.Share.Text":{
			_:	"Momoko flew the meteorite $0 $1 away!",
			ja:	"桃子ちゃんは隕石を$1$2吹っ飛ばしました！",
		},

		//ウェブページURL Web Page URL
		"GamePlay.Share.URL":{
			_:	"https://example.jp/",
		},

		//タグ Tag
		"GamePlay.Share.Tags":{
			_:	"MeteorStrikerMomoko",
			ja:	"メテオストライカー桃子",
		},


	//----------------------------------------
	// 実績
	// Achievements
	//----------------------------------------

		//実績解除ラベル Label of Unlocking
		"Achievement.Unlocked" :{
			_:	"Achievement Unlocked!!",
			ja:	"実績解除!",
		},

		//パーフェクト一定回数 Many Perfect Blows
		"Achievement.Aiming.ManyPerfect":{
			_:	"Perfect Sun",
			ja:	"パーフェクトサン",	//パーフェクトサン
		},
		"Achievement.Aiming.ManyPerfect.Text":{
			_:	"Got $0 perfect aims.",
			ja:	"$0回パーフェクトを出した",
		},

		//グッド以上を一定回数 Many Good/Perfect Blows
		"Achievement.Aiming.ManyGood":{
			_:	"Good-Aims, Baby",	//Good-Sleep,Baby
		},
		"Achievement.Aiming.ManyGood.Text":{
			_:	"Got $0 good or better aims",
			ja:	"$0回グッド以上を出した",
		},

		//100%エイム 100% Aim
		"Achievement.Aiming.TruePerfect":{
			_:	"Self-Styled Perfect",
			ja:	"自称・カンペキ",	//輿水幸子
		},
		"Achievement.Aiming.TruePerfect.Text":{
			_:	"Succeeded in 100% aim.",
			ja:	"100%エイムに成功した",
		},

		//強打を一定回数 Many Hardblows
		"Achievement.Blowing.ManyHard":{
			_:	"ART NEEDS HARD-BLOWS",	//ART NEEDS HAERT BEATS
		},
		"Achievement.Blowing.ManyHard.Text":{
			_:	"Hardblowed $0 times.",
			ja:	"$0回強打した",
		},

		//強打かつパーフェクト Hardblow And Perfect Aim
		"Achievement.Blowing.HardAndPerfect":{
			_:	"Perfect Hard☆",
			ja:	"パーフェクトっすハード☆",	//しゅがーはぁとレボリューション
		},
		"Achievement.Blowing.HardAndPerfect.Text":{
			_:	"Hardblowed with a perfect aim.",
			ja:	"強打でパーフェクトを出した",
		},

		//打撃を連続成功 Successive Hits Without Failure
		"Achievement.Blowing.SuccessiveHits":{
			_:	"Into Perpetual Hit Machines, L'Antica!",
			ja:	"永久ヒットにしてゆくよ 安定化!",	//バベルシティグレイス
		},
		"Achievement.Blowing.SuccessiveHits.Text":{
			_:	"Hit $0 times in a row without failure.",
			ja:	"失敗せず$0回連続でヒットさせた",
		},

		//エミット回数実績その1 Emit Rate #01
		"Achievement.Emit.Many01":{
			_:	"Gentle Emt",
			ja:	"Gentleエミット",	//オーバーマスター
		},
		"Achievement.Emit.Many01.Text":{
			_:	"Emitted $0$1 and more.",
			ja:	"エミット倍率$0$1以上を出した",
		},

		//エミット回数実績その2 Emit Rate #02
		"Achievement.Emit.Many02":{
			_:	"Wild Emit",
			ja:	"Wildエミット",	//オーバーマスター
		},
		"Achievement.Emit.Many02.Text":{
			_:	"Emitted $0$1 and more.",
			ja:	"エミット倍率$0$1以上を出した",
		},

		//エミット回数実績その3 Emit Rate #03
		"Achievement.Emit.Many03":{
			_:	"Dangerous Emit",
			ja:	"Dangerousエミット",	//オーバーマスター
		},
		"Achievement.Emit.Many03.Text":{
			_:	"Emitted $0$1 and more.",
			ja:	"エミット倍率$0$1以上を出した",
		},

		//エミット回数実績その4 Emit Rate #04
		"Achievement.Emit.Many04":{
			_:	"Over-emit",
			ja:	"オーバーエミット",	//オーバーマスター
		},
		"Achievement.Emit.Many04.Text":{
			_:	"Emitted $0$1 and more.",
			ja:	"エミット倍率$0$1以上を出した",
		},

		//金星到達 Venus
		"Achievement.Check.Venus":{
			_:	"Do You Know Venus?",	//ヴィーナスシンドローム
		},
		"Achievement.Check.Venus.Text":{
			_:	"Flew the meteorite over $1$2.",
			ja:	"隕石を$1$2以上吹っ飛ばした",
		},

		//火星到達 Mars
		"Achievement.Check.Mars":{
			_:	"Beyond The Mars",
			ja:	"ビヨンドザマーズ",	//ビヨンドザスターズ
		},
		"Achievement.Check.Mars.Text":{
			_:	"Flew the meteorite over $1$2.",
			ja:	"隕石を$1$2以上吹っ飛ばした",
		},

		//水星到達 Mercury
		//	（Beyond The Dream）
		"Achievement.Check.Mercury":{
			_:	"Go Straight Ahead, Cross Over Mercury",
			ja:	"進めまっすぐ 水星越えて",
		},
		"Achievement.Check.Mercury.Text":{
			_:	"Flew the meteorite over $1$2.",
			ja:	"隕石を$1$2以上吹っ飛ばした",
		},

		//太陽到達 Sun
		"Achievement.Check.Sun":{
			_:	"BEYOND THE SUNLIGHT",	//BEYOND THE STARLIGHT
		},
		"Achievement.Check.Sun.Text":{
			_:	"Flew the meteorite over $1$2.",
			ja:	"隕石を$1$2以上吹っ飛ばした",
		},

		//諸星きらり到達 Kirarin Robot
		"Achievement.Check.Kirari":{
			_:	"Kirari, Passed Through The Row of Light",
			ja:	"キラリ 光の列すり抜けたら",	//Kosmos,Cosmos
		},
		"Achievement.Check.Kirari.Text":{
			_:	"Flew the meteorite over $1$2.",
			ja:	"隕石を$1$2以上吹っ飛ばした",
		},

		//2.5億km到達 250,000,000km
		"Achievement.Check.Unicorn":{
			_:	"Tell Me the Pink Unicorn...",
			ja:	"教えてpink unicorn...",	//教え絵last note...
		},
		"Achievement.Check.Unicorn.Text":{
			_:	"Flew the meteorite over $1$2.",
			ja:	"隕石を$1$2以上吹っ飛ばした",
		},

		//実績コンプリート
		"Achievement.Action.Complete":{
			_:	"Special Meteor Strike!",
			ja:	"必殺のメテオストライク!",	//必殺のメテオストライク！ 周防桃子
		},
		"Achievement.Action.Complete.Text":{
			_:	"Unlocked all achievements",
			ja:	"全ての実績を解放した",
		},

		//初プレイ First Play
		"Achievement.Action.FirstPlay":{
			_:	"For Save The Earth Crisis",
			ja:	"地球の危機を救うため",	//地球の危機を救うため 周防桃子
		},
		"Achievement.Action.FirstPlay.Text":{
			_:	"Stopped the meteorite and saved the Earth.",
			ja:	"隕石を食い止めて世界を救った",
		},

		//結果シェア Share Result
		"Achievement.Action.Share":{
			_:	"Shared Your Result",
			ja:	"結果をシェアして",	//ドレミファクトリー！
		},
		"Achievement.Action.Share.Text":{
			_:	"We post $0 tweets.",
			ja:	"ツイート✕$0投稿するんだ",
		},

};

