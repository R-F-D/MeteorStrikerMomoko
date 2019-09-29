/** @const リソースファイル設定 */
const rc	= {
	/** リソースディレクトリ */
	DIRECTORY	: "../Res/",

	/** 画像 */
	img	: {
		devLogo			: [ "Text/devLogo.png",		1,	1,	],	//開発者ロゴ
		title			: [ "Text/title.png",		1,	1,	],	//タイトルロゴ

		bgGround		: [ "Bg/bgGround.png",		1,	1,	],	//背景（地上）
		bgSpace			: [ "Bg/bgSpace.png",		1,	1,	],	//背景（宇宙）
		bgLaunch		: [ "Text/bgLaunch.png",	1,	1,	],	//背景（シーン開始テキスト）
		player			: [ "Actor/momoko.png",		4,	4,	],	//プレイヤーキャラクター
		navigator		: [ "Text/navigator.png",	5,	5,	],	//ナビゲーターアイコン
		aimCursor		: [ "Aim/aimcur.png",		2,	2,	],	//エイミングカーソル
		aimBar			: [ "Aim/aimBar.png",		1,	1,	],	//エイミングゲージ
		aimValue		: [ "Aim/aimValue.png",		4,	3,	],	//エイミング値
		hitArea			: [ "Aim/hitarea.png",		1,	4,	],	//ヒット領域
		meteor			: [ "Actor/meteor.png",		1,	1,	],	//メテオ
		distance		: [ "Text/distance.png",	1,	1,	],	//飛距離表示

		txtLaunch		: [ "Text/txtLaunch.png",	1,	2,	],	//シーン入場テキスト
		balloonTail		: [ "Text/balloonTail.png",	1,	1,	],	//フキダシしっぽ
		achievement		: [ "Text/achievement.png",	4,	4,	],	//実績アイコン

		flare			: [ "Fx/fxFlare.png",		1,	1,	],	//隕石エフェクト
		explosion		: [ "Fx/fxExplosion.png",	1,	1,	],	//爆発エフェクト
		flyFx			: [ "Fx/fxFly.png",			1,	1,	],	//プレイヤーエフェクト
		hitFx			: [ "Fx/fxHit.png",			2,	4,	],	//ヒットエフェクト
		preliminaryFx	: [ "Fx/fxPreliminary.png",	1,	1,	],	//予備動作エフェクト
		emitFx			: [ "Fx/fxEmit.png",		4,	2,	],	//エミットエフェクト
		touched			: [ "Fx/fxTouch.png",		4,	2,	],	//タッチエフェクト

		navigationButton: [ "Ui/btnNavigation.png",	2,	2,	],	//ナビゲーションボタン
		titleButton		: [ "Ui/btnTitle.png",		4,	6,	],	//タイトル画面等のボタン
		labelButton		: [ "Ui/btnLabel.png",		1,	1,	],	//ラベル付きボタン
	},

	/** サウンド */
	sfx	: {
	},
	bgm	: {
		meteorite:		"meteorite.mp3",
		strike:			"strike.mp3",
	},

	/** システム用 */
	sysImg	: {
		white	: "Sys/white.png",
	},

	/** フォント名 */
	font	: {
		talk		: {	Family:"Kosugi Maru",	},
		distance	: {	Family:"VT323",			},
	},
};



var g_resources = [];
for(let i in rc.sysImg)	g_resources.push(`${rc.DIRECTORY}${rc.sysImg[i]}`);
for(let i in rc.img)	g_resources.push(`${rc.DIRECTORY}Img/${rc.img[i][0]}`);
