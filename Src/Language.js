/********************************************************************************
	 地域別のテキストと数値区切り設定
	 Text And Number Separaotors
********************************************************************************/

/********************************************************************************
 * 数値の区切り
 * Hash of Numeric Separations
 *******************************************************************************/
// eslint-disable-next-line no-unused-vars
var NumericSeparators	= (()=>{return{
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
}})();


/********************************************************************************
 * ローカライズされたテキストの一覧
 * Hash of Localized Texts
 *******************************************************************************/
// eslint-disable-next-line no-unused-vars
var LocalizedTexts	= (()=>{return{

	//----------------------------------------
	// 単位
	// Unit
	//----------------------------------------
		"Unit.Distance":{_:"km",},					//飛距離の単位 Distance
		"Unit.Aim":		{_:"%", },					//エイミング精度の単位 Aim
		"Unit.Blow":	{_:"%", },					//打撃倍率の単位 Charge
		"Unit.Emit":	{_:"%", },					//エミット倍率の単位 Emit
		"Unit.Counter":	{_:"$0", ja:"$0回",	},		//Records>カウンタの単位（デフォルト） Records > Counter(Default)

	//----------------------------------------
	// タイトル画面
	// Title Scene
	//----------------------------------------

		//プレイボタン Play Button
		"Title.Button.Play":{
			_:	"Play game",
			ja:	"ゲームをプレイ",
		},

		//レコードボタン Records Button
		"Title.Button.Records":{
			_:	"Achievements and records.",
			ja:	"記録と実績",
		},

		//ヘルプボタン Help Button
		"Title.Button.Help":{
			_:	"How to play, and so on.",
			ja:	"ゲームの遊び方など",
		},

		//設定ボタン Settings Button
		"Title.Button.Settings":{
			_:	"Settings.",
			ja:	"設定",
		},

		//ウェブページボタン Webpage Button
		"Title.Button.Home":{
			_:	"Go to the webpage.",
			ja:	"ウェブページ",
		},

		//ハッシュタグ検索 Hashtag Search Button
		"Title.Button.Search":{
			_:	"Hashtag search.",
			ja:	"ハッシュタグ検索",
		},

		//プレイヤーをクリック時 On Click The Player
		"Title.Reaction.Player":{
			_:	"Momoko dakedo.",
			ja:	"桃子だけど。",
		},


	//----------------------------------------
	// ロゴ＆遷移画面
	// Logo Scene & Transition Scene
	//----------------------------------------

		//遷移中 Transition Message
		"Logo.ToStart":{
			_:	"Clck / Tap  to  start",
			ja:	"クリック/タップでスタート",
		},

		//遷移中 Transition Message
		"Transition.Wait":{
			_:	"Look forward!",
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
	// 設定画面
	// Settings
	//----------------------------------------

		//ロックパネル（ロック時） Locked
		"Settings.LockPanel.Locked": {
			_:	"This selector is locked.",
			ja:	"この項目はロックされています。",
		},
		//ロックパネル（解除可能時） Unlock-able
		"Settings.LockPanel.Breakable": {
			_:	"Click/Tap here.",
			ja:	"クリック/タップしてください。",
		},
		//ロックパネルの解除条件 Conditions of unlocking
		"Settings.LockPanel.Cond": {
			_:	"Condition: $0",
			en:	"Cond: $0",
			ja:	"条件：$0",
		},
		//ロックパネルの達成された解除条件 Filled Conditions
		"Settings.LockPanel.Filled": {
			_:	"Filled: $0",
			ja:	"達成：$0",
		},

		//地域・言語設定 Locale & Language
		"Settings.Locale":	{
			_:	"Language",
			ja:	"言語",
		},
		"Settings.Locale.Label._":	{_:	"Universal",},			//Universal
		"Settings.Locale.Label.en":	{_:	"English",},			//English-Speaking Countries
		"Settings.Locale.Label.ja":	{_:	"日本語\nJapanese",},	//Japan

		//SFX音量設定 Sound Effect Volume
		"Settings.SfxVolume":	{
			_:	"SFX Volume",
			ja:	"効果音音量",
		},
		"Settings.SfxVolume.Label.0":	{_: "0",	en:"Off",	ja:"なし",	},	//Volume 0%(Off)
		"Settings.SfxVolume.Label.1":	{_:	"1",	en:"♪",		ja:"♪",		},	//Volume 20%
		"Settings.SfxVolume.Label.2":	{_:	"2",	en:"♪♪",	ja:"♪♪",	},	//Volume 40%
		"Settings.SfxVolume.Label.3":	{_:	"3",	en:"♪♪♪",	ja:"♪♪♪",	},	//Volume 60%
		"Settings.SfxVolume.Label.4":	{_:	"4",	en:"♪♪♪♪",	ja:"♪♪♪♪",	},	//Volume 80%
		"Settings.SfxVolume.Label.5":	{_:	"5",	en:"♪♪♪♪♪",	ja:"♪♪♪♪♪",	},	//Volume 100%(Max)

		//BGM音量設定 Background Music Volume
		"Settings.BgmVolume":	{
			_:	"Music Volume",
			ja:	"BGM音量",
		},
		"Settings.BgmVolume.Label.0":	{_: "0",	en:"Off",	ja:"なし",	},	//Volume 0%(Off)
		"Settings.BgmVolume.Label.1":	{_:	"1",	en:"♪",		ja:"♪",		},	//Volume 20%
		"Settings.BgmVolume.Label.2":	{_:	"2",	en:"♪♪",	ja:"♪♪",	},	//Volume 40%
		"Settings.BgmVolume.Label.3":	{_:	"3",	en:"♪♪♪",	ja:"♪♪♪",	},	//Volume 60%
		"Settings.BgmVolume.Label.4":	{_:	"4",	en:"♪♪♪♪",	ja:"♪♪♪♪",	},	//Volume 80%
		"Settings.BgmVolume.Label.5":	{_:	"5",	en:"♪♪♪♪♪",	ja:"♪♪♪♪♪",	},	//Volume 100%(Max)

		//隕石設定 Meteorite
		"Settings.Meteorite":	{
			_:	"Meteorite",
			ja:	"隕石",
		},
		"Settings.Meteorite.Label.Normal":		{_:	"Meteorite",						ja:"隕石",		},	//Meteorite
		"Settings.Meteorite.Label.Bear":		{_:	"Teddy Bear",	en:	"Kuma-kun",		ja:"クマくん",	},	//Kuma-kun
		"Settings.Meteorite.Label.Triangle":	{_:	"Triangle",		en:	"△Triangle",	ja:"△さんかく",	},	//Triangle

		"Settings.Meteorite.Locked":	{
			_:	"Unlocking achievement \"Momoko Dakedo.\"",
			ja:	"実績「桃子だけど。」の解除",
		},

		//ナビゲーター設定 Navigator
		"Settings.Navigator":	{
			_:	"Navigator",
			ja:	"ナビゲーター",
		},
		"Settings.Navigator.Label.Normal":	{_:	"NAKATANI\nIku",			ja:"中谷育",				},	//Iku
		"Settings.Navigator.Label.Golem":	{_:	"First\nFriend",			ja:"初めての\nともだち",	},	//Golem
		"Settings.Navigator.Label.Goddess":	{_:	"Goddess of\nThe Earth",	ja:"大地の女神",			},	//Goddess

		"Settings.Navigator.Locked":	{
			_:	"Saving the Earth 5 times",
			ja:	"世界を5回救う",
		},

		//ストレージ管理 Storage Management
		"Settings.Storage":	{
			_:	"Storage Management",
			ja:	"ストレージ管理",
		},
		"Settings.Storage.Label.RemoveSettings":	{_:	"Remove\nSettings",		ja:"設定の削除",	},	//Remove settings
		"Settings.Storage.Label.RemoveRecords":		{_:	"Remove\nRecords",		ja:"記録の削除",	},	//Remove records
		"Settings.Storage.Label.RemoveAchievements":{_:	"Remove\nAchievements",	ja:"実績の削除",	},	//Remove achievements
		"Settings.Storage.Label.Remove":			{_:	"Remove All",			ja:"全削除",		},	//Remove all data

		"Settings.Storage.Confirm.RemoveSettings":{		//Confirm: Remove settings
			_:	"Are you sure you want to remove the game settings?",
			ja:	"ゲーム設定を削除しますか？",
		},
		"Settings.Storage.Confirm.RemoveRecords":{		//Confirm: Remove records
			_:	"Are you sure you want to remove the play records?",
			ja:	"プレイ記録を削除しますか？",
		},
		"Settings.Storage.Confirm.RemoveAchievements":{	//Confirm: Remove achievements
			_:	"Are you sure you want to remove the achievements?",
			ja:	"実績を削除しますか？",
		},
		"Settings.Storage.Confirm.Remove":{				//Confirm: Remove all data
			_:	"Are you sure you want to remove all data?",
			ja:	"全てのデータを削除しますか？",
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

		//リトライ回数 Number of Retrys
		"Records.Action.NumRetrys":{
			_:	"Retrys",
			ja:	"リトライ回数",
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

		//シェア回数 Number of Shares
		"Records.Action.NumShares":{
			_:	"Shares",
			ja:	"シェア回数",
		},

		//実績解除率（トータル） Ratio of All Unlocked Achievements
		"Records.Action.TotalUnlockedAchievements":{
			_:	"Achievement Ratio",
			ja:	"実績達成率",
		},
		"Records.Action.TotalUnlockedAchievements.Format":{
			_:	"$0%",
		},
		//実績解除数（ランク別） Number of Unlocked Achievements By Rank
		"Records.Action.NumUnlockedAchievements.00":{
			_:	"Bronze Momokos",
			ja:	"ブロンズ桃子",
		},
		"Records.Action.NumUnlockedAchievements.01":{
			_:	"Silver Momokos",
			ja:	"シルバー桃子",
		},
		"Records.Action.NumUnlockedAchievements.02":{
			_:	"Gold Momokos",
			ja:	"ゴールド桃子",
		},
		"Records.Action.NumUnlockedAchievements.03":{
			_:	"Platinum Momokos",
			ja:	"プラチナ桃子",
		},
		"Records.Action.NumUnlockedAchievements.00.Format":{
			_:	"$0",
			ja:	"$0個",
		},
		"Records.Action.NumUnlockedAchievements.01.Format":{
			_:	"$0",
			ja:	"$0個",
		},
		"Records.Action.NumUnlockedAchievements.02.Format":{
			_:	"$0",
			ja:	"$0個",
		},
		"Records.Action.NumUnlockedAchievements.03.Format":{
			_:	"$0",
			ja:	"$0個",
		},

		//各ナビゲーション回数 Number of Navigates
		"Records.Action.NumNavigates.00":{
			_:	"NAKATANI Iku Navigates",
			ja:	"中谷育のナビ回数",
		},
		"Records.Action.NumNavigates.01":{
			_:	"First Friend Navigates",
			ja:	"初めてのともだちのナビ回数",
		},
		"Records.Action.NumNavigates.01.Secret":{
			_:	"???????? Navigates",
			ja:	"？？？？のナビ回数",
		},
		"Records.Action.NumNavigates.02":{
			_:	"Goddess of The Earth Navigates",
			ja:	"大地の女神のナビ回数",
		},
		"Records.Action.NumNavigates.02.Secret":{
			_:	"???????? Navigates",
			ja:	"？？？？のナビ回数",
		},

		//プレイヤーキャラクターをタッチした回数 Number of Touches Player Character
		"Records.Action.NumTouchesPlayer":{
			_:	"Touches Momoko",
			ja:	"桃子にタッチした回数",
		},

		//各隕石エンゲージ回数 Number of Meteorite Engagements
		"Records.Action.NumMeteoriteEngages.00":{
			_:	"Meteorite Engagements",
			ja:	"隕石との交戦回数",
		},
		"Records.Action.NumMeteoriteEngages.01":{
			_:	"Teddy Bear Engagements",
			en:	"Kuma-kun Engagements",
			ja:	"クマくんとの交戦回数",
		},
		"Records.Action.NumMeteoriteEngages.01.Secret":{
			_:	"???????? Engagements",
			ja:	"？？？？との交戦回数",
		},
		"Records.Action.NumMeteoriteEngages.02":{
			_:	"△Triangle Engagements",
			ja:	"△さんかくとの交戦回数",
		},
		"Records.Action.NumMeteoriteEngages.02.Secret":{
			_:	"???????? Engagements",
			ja:	"？？？？との交戦回数",
		},


	//----------------------------------------
	// シェア Share
	//----------------------------------------

		//Twitter Intent
		"About.Share.Format":{
			_:	"https://twitter.com/intent/tweet?text=$0%0a%23$2%0a$1",
		},

		//ハッシュタグ検索 Hashtag Search
		"About.Search.Format":{
			_:	"https://twitter.com/hashtag/$0",
		},

		//ツイート文字列 Tweet Text
		"About.Share.Text":{
			_:	"Momoko flew the meteorite to $0 $1 away!",
			ja:	"桃子ちゃんは隕石を$0$1吹っ飛ばしました！",
		},

		//タグ Tag
		"About.HashTags":{
			_:	"MeteorMomoko",
			ja:	"メテオ桃子だけど",
		},


	//----------------------------------------
	// 実績
	// Achievements
	//----------------------------------------

		//実績解除ラベル Label of Unlocking
		"Achievement.Unlocked" :{
			_:	"Achievement Unlocked!",
			ja:	"実績解除!",
		},

		//シークレット項目 Secret
		"Achievement.Secret":{
			_:	"??????????",
			ja:	"？？？？？",
		},
		"Achievement.Secret.Text":{
			_:	"?????????? ??????????",
			ja:	"？？？？？？？？？？",
		},

		//パーフェクト一定回数 Many Perfect Blows
		"Achievement.Aiming.ManyPerfect":{
			_:	"Perfect Sun",
			ja:	"パーフェクトサン",	//パーフェクトサン
		},
		"Achievement.Aiming.ManyPerfect.Text":{
			_:	"Got $0 perfect aims.\nWe'll surely see a new world.",
			ja:	"$0回パーフェクトを出した。\n必ず見える新しい世界。",
		},

		//グッド以上を一定回数 Many Good/Perfect Blows
		"Achievement.Aiming.ManyGood":{
			_:	"Good-Aims, Baby",	//Good-Sleep,Baby
		},
		"Achievement.Aiming.ManyGood.Text":{
			_:	"Got $0 good or better aims.\nHave a good dream.",
			ja:	"$0回グッド以上を出した。\nいい夢を。",
		},

		//100%エイム 100% Aim
		"Achievement.Aiming.TruePerfect":{
			_:	"Self-Styled Perfect",
			ja:	"自称・カンペキ",	//輿水幸子
		},
		"Achievement.Aiming.TruePerfect.Text":{
			_:	"Succeeded in 100% aim.\nMy kawaii doesn't stop.",
			ja:	"100%エイムに成功した。\nカワイイが止まらない。",
		},

		//強打を一定回数 Many Hardblows
		"Achievement.Blowing.ManyHard":{
			_:	"Art Needs Hard-Brows",	//ART NEEDS HAERT BEATS
			ja:	"ART NEEDS HARD-BLOWS",	//ART NEEDS HAERT BEATS
		},
		"Achievement.Blowing.ManyHard.Text":{
			_:	"Hardblowed $0 times.\nExperience you have never.",
			ja:	"$0回強打した。\n感じたことのないエクスペリエンス。",
		},

		//強打かつパーフェクト Hardblow And Perfect Aim
		"Achievement.Blowing.HardAndPerfect":{
			_:	"Perfect, Perfect, Perfect Hard",
			en:	"Perfect³ Hard☆",
			ja:	"パーフェクトっす³ ハード☆",	//しゅがーはぁとレボリューション
		},
		"Achievement.Blowing.HardAndPerfect.Text":{
			_:	"Hardblowed with a perfect aim $0 times.\n(Note: It's a user thought)",
			ja:	"強打でパーフェクトを$0回出した。\n(注:使用者の感想です)",
		},

		//打撃を連続成功 Successive Hits Without Failure
		"Achievement.Blowing.SuccessiveHits":{
			_:	"L’ANTICA!",
			ja:	"\"安定化(あんていか)\"",	//バベルシティグレイス
		},
		"Achievement.Blowing.SuccessiveHits.Text":{
			_:	"Hit $0 times in a row without failure.\nInto Perpetual Hit Machines, ",
			ja:	"失敗せず$0回連続でヒットさせた。\n永久ヒットにしてゆくよ。",
		},

		//エミット回数実績その1 Emit Rate #01
		"Achievement.Emit.Many01":{
			_:	"Gentle Emt",
			ja:	"ジェントルエミット",	//オーバーマスター
		},
		"Achievement.Emit.Many01.Text":{
			_:	"Emitted $0$1 and more.\nNo such the theill-less emittings...",
			ja:	"エミット倍率$0$1以上を出した。\nスリルのないエミットなんて…",
		},

		//エミット回数実績その2 Emit Rate #02
		"Achievement.Emit.Many02":{
			_:	"Wild Emit",
			ja:	"ワイルドエミット",	//オーバーマスター
		},
		"Achievement.Emit.Many02.Text":{
			_:	"Emitted $0$1 and more.\nThe emittings breaked the taboos are...",
			ja:	"エミット倍率$0$1以上を出した。\nタブーを冒せるエミットは…",
		},

		//エミット回数実績その3 Emit Rate #03
		"Achievement.Emit.Many03":{
			_:	"Dangerous Emit",
			ja:	"デンジャラスエミット",	//オーバーマスター
		},
		"Achievement.Emit.Many03.Text":{
			_:	"Emitted $0$1 and more.\nIsn’t it impossible?",
			ja:	"エミット倍率$0$1以上を出した。\nありえなくない？",
		},

		//金星到達 Venus
		"Achievement.Check.Venus":{
			_:	"Do You Know Venus?",	//ヴィーナスシンドローム
		},
		"Achievement.Check.Venus.Text":{
			_:	"Flew the meteorite over $1$2.\nThe goddess striked the meteorite so",
			ja:	"隕石を$1$2以上吹っ飛ばした。\nそう女神は隕石を打ち付けた。",
		},

		//火星到達 Mars
		"Achievement.Check.Mars":{
			_:	"Echoes on Mars and They Start!",
			ja:	"マーズに響いてスタート!",	//プリンセスアラモード
		},
		"Achievement.Check.Mars.Text":{
			_:	"Flew the meteorite over $1$2.\nEscort me nicely, please?",
			ja:	"隕石を$1$2以上吹っ飛ばした。\n素敵にエスコートしてくださいね?",
		},

		//水星到達 Mercury
		//	（Beyond The Dream）
		"Achievement.Check.Mercury":{
			_:	"Go Straight Ahead, Cross Over Mercury",
			ja:	"進めまっすぐ 水星越えて",
		},
		"Achievement.Check.Mercury.Text":{
			_:	"Flew the meteorite over $1$2.\nLet's go together beyond the space.",
			ja:	"隕石を$1$2以上吹っ飛ばした。\n一緒に行こう宇宙の向こうへ。",
		},

		//太陽到達 Sun
		"Achievement.Check.Sun":{
			_:	"Beyond the Sunlight",	//BEYOND THE STARLIGHT
			ja:	"BEYOND THE SUNLIGHT",	//BEYOND THE STARLIGHT
		},
		"Achievement.Check.Sun.Text":{
			_:	"Flew the meteorite over $1$2.\nSend farther than anyone else.",
			ja:	"隕石を$1$2以上吹っ飛ばした\n誰よりも飛ばせ。",
		},

		//諸星きらり到達 Kirarin Robot
		"Achievement.Check.Kirari":{
			_:	"Kirari, Passed Through the Row of Light",
			ja:	"キラリ 光の列すり抜けたら",	//Kosmos,Cosmos
		},
		"Achievement.Check.Kirari.Text":{
			_:	"Flew the meteorite over $1$2.\nTake off.",
			ja:	"隕石を$1$2以上吹っ飛ばした。\n跳び出してゆく。",
		},

		//2.5億km到達 250,000,000km
		"Achievement.Check.Unicorn":{
			_:	"Tell Me the Pink Unicorn...",
			ja:	"教えてpink unicorn...",	//教え絵last note...
		},
		"Achievement.Check.Unicorn.Text":{
			_:	"Flew the meteorite over $1$2.\n...I say bye bye.",
			ja:	"隕石を$1$2以上吹っ飛ばした。\n……バイバイ。",
		},

		//実績コンプリート
		"Achievement.Action.Complete":{
			_:	"Special Meteor Strike!",
			ja:	"必殺のメテオストライク!",	//必殺のメテオストライク！ 周防桃子
		},
		"Achievement.Action.Complete.Text":{
			_:	"Unlocked all achievements.\nThe meteorite was KO in one!",
			ja:	"全ての実績を解放した。\n隕石なんて一発でKOだったね!",
		},

		//初プレイ First Play
		"Achievement.Action.FirstPlay":{
			_:	"For Save the Earth Crisis",
			ja:	"地球の危機を救うため",	//地球の危機を救うため 周防桃子
		},
		"Achievement.Action.FirstPlay.Text":{
			_:	"Stopped the meteorite and saved the Earth.\nI have to do something...!",
			ja:	"隕石を食い止めて世界を救った。\n桃子がなんとかしなきゃ…!",
		},

		//リトライ Retry
		"Achievement.Action.Retry":{
			_:	"Good Luck Next Time!",
			ja:	"次回も頑張ってもらうぞ！",	//シャニマス（天井社長）
		},
		"Achievement.Action.Retry.Text":{
			_:	"Retryed games $0 times.\nIf I can't meet Momoko,\nor you've made a different choice...\nWhat happened to the Earth...?",
			ja:	"ゲームを$0回リトライした。\nもし桃子ちゃんに会えてなかったり\n違う選択してたら…\n地球、どうなってたのかなって…",	//シャニマスED（園田智代子WING）
		},

		//結果シェア Share Result
		"Achievement.Action.Share01":{
			_:	"Share Your Result",
			ja:	"結果をシェアして",	//ドレミファクトリー！
		},
		"Achievement.Action.Share01.Text":{
			_:	"We post a tweet, tweet, tweet.",
			ja:	"ツイートツイートツイート 投稿するんだ。",
		},

		//結果シェア（好成績） Share Result (Successful)
		"Achievement.Action.Share02":{
			_:	"See You in My Dream",
			en:	"See You in My Dream♪",
			ja:	"夢でおあいしましょう♪",	//デコレーション・ドリ〜ミンッ♪
		},
		"Achievement.Action.Share02.Text":{
			_:	"Shared results $0 times.\n(Requires $1+ $2)\nAll, enjoy yourself!",
			ja:	"結果を$0回シェアした。（要$1$2以上）\nみんな、思いっきり楽しんでってねー！",
		},

		//プレイ時間 Play Time
		"Achievement.Action.PlayTime":{
			_:	"In a Long Time",
			ja:	"長い時間の中で",	//思い出をありがとう
		},
		"Achievement.Action.PlayTime.Text":{
			_:	"The total play time exceeded $0 seconds.\nThank you for the memories.",
			ja:	"合計プレイ時間が$0秒を越えた。思い出をありがとう。",
		},

		//起動日数 Booting Days
		"Achievement.Action.BootDays":{
			_:	"\"Tadaima\"",
			ja:	"「ただいま」",	// HOME, SWEET FRIENDSHIP
		},
		"Achievement.Action.BootDays.Text":{
			_:	"Booted the game a total of $0 days.\nFeel like a home game...",
			ja:	"計$0日間ゲームを起動した。\nFeel like a home game...",
		},

		//最終起動日からの時間経過
		"Achievement.Action.DaysPassed":{
			_:	"I Haven't Seen You Before...!",
			ja:	"見ない顔ですねぇ…！",	//小宮果穂
		},
		"Achievement.Action.DaysPassed.Text":{
			_:	"$0 days passed since the last booting,\nor started a total of $1 days.\nMOMOKO...SAVES MANY WORLDS A LOT!",
			ja:	"最後に起動してから$0日が経過、\nもしくは計$1日間ゲームを起動した。\n桃子ちゃんはー……いろんな世界を、いっぱい救いまーす！",
		},

		//月曜日または9時台に起動
		"Achievement.Action.Monday9":{
			_:	"Ice \"9 Letters\" on Monday",
			ja:	"月曜日の9リームソーダ",	///月曜日のクリームソーダ
		},
		"Achievement.Action.Monday9.Text":{
			_:	"Booted at/on 9, 19, 21, Monday *9th...OK?",
			ja:	"月曜日、○9日、9/19/21時台いずれかに起動した…オケ?",
		},

		//桃子だけど
		"Achievement.Action.TouchPlayer":{
			_:	"Momoko Dakedo.",
			ja:	"桃子だけど。",	//桃子だけど。
		},
		"Achievement.Action.TouchPlayer.Text":{
			_:	"Touched Momoko in the title. \nWell then, see you.",
			ja:	"タイトル画面で桃子にタッチした。\nそれじゃあ、またね。",
		},

		//隕石（ノーマル）破壊 Meteorite Engagement
		"Achievement.Action.Meteorite00":{
			_:	"Like a Meteorite Parade!",
			ja:	"まるで隕石のPARADE!",	//流星PARADE
		},
		"Achievement.Action.Meteorite00.Text":{
			_:	"Rejected meteorites $0 times.\nSee off the orange rocks.",
			ja:	"隕石を$0回退けた。\nオレンジ色の岩を見送って。",	//
		},

		//クマくん破壊 Kuma-kunEngagement
		"Achievement.Action.Meteorite01":{
			_:	"Waltz of The Sky, Wind and Bear",
			ja:	"空と風と熊のワルツ",	//空と風と恋のワルツ
		},
		"Achievement.Action.Meteorite01.Text":{
			_:	"Rejected teddy bears $0 times.\n(N-No!)",
			en:	"Rejected Kuma-kun $0 times.\n(N-No!)",
			ja:	"クマくんを$0回退けた。\n（だっ だめ…！）",
		},

		//さんかく破壊 Triangle Engagement
		"Achievement.Action.Meteorite02":{
			_:	"Triple Scales",
			en:	"Triple Scales☆☆★",
			ja:	"ミツウロコ☆☆★",	//ミツボシ☆☆★
		},
		"Achievement.Action.Meteorite02.Text":{
			_:	"Rejected triangles $0 times.\nI'm not afraid to enter atmosphere.",
			ja:	"さんかくを$0回退けた。\n大気圏突入も怖くない。",	//
		},

		//ナビゲータ（ノーマル）使用
		"Achievement.Action.Navigate00":{
			_:	"Navigator Goes The Space",
			ja:	"ナビゲーター宇宙を往く",	//エージェント夜を往く
		},
		"Achievement.Action.Navigate00.Text":{
			_:	"NAKATANI Iku navigated $0 times.\nI can lead you completely everywhere.",
			ja:	"中谷育が$0回ナビゲートした。\nどんな道も万全に率いられる。",
		},

		//ナビゲータ（ゴーレム）使用
		"Achievement.Action.Navigate01":{
			_:	"Wandering Golem Navigator",	//Wandering Dream Chaser
		},
		"Achievement.Action.Navigate01.Text":{
			_:	"First friend navigated $0 times.\nAs I have a something to reach for.",
			ja:	"初めてのともだちが$0回ナビゲートした。\n目指すものがあるから。",
		},

		//ナビゲータ（女神）使用
		"Achievement.Action.Navigate02":{
			_:	"Navigation of Light",
			ja:	"ヒカリのnavigation",	//ヒカリのdestination
		},
		"Achievement.Action.Navigate02.Text":{
			_:	"Goddess of the earth navigated $0 times.\nStart running to the base of radiance.",
			ja:	"大地の女神が$0回ナビゲートした。\n輝きのたもとへ走り出そうよ。",
		},

}})();

