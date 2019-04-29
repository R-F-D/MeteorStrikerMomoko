/** @const リソースファイル設定 */
const rc	= {
	/** リソースディレクトリ */
	DIRECTORY	: "../Res/",

	/** 画像 */
	img	: {
		logo			: [ "logo.png",				1,	1,	],	//タイトルロゴ

		bgGround		: [ "bgGround.png",			1,	1,	],	//背景（地上）
		bgSpace			: [ "bgSpace.png",			1,	1,	],	//背景（宇宙）
		player			: [ "momoko.png",			4,	4,	],	//プレイヤーキャラクター
		navigator		: [ "navigator.png",		2,	2,	],	//ナビゲータ
		aimCursor		: [ "aimcur.png",			2,	2,	],	//エイミングカーソル
		aimGauge		: [ "aimgauge.png",			1,	1,	],	//エイミングゲージ
		hitArea			: [ "hitarea.png",			1,	4,	],	//ヒット領域
		meteor			: [ "meteor.png",			1,	1,	],	//メテオ
		distance		: [ "distance.png",			1,	1,	],	//飛距離表示

		flare			: [ "Fx/fxFlare.png",		1,	1,	],	//隕石エフェクト
		explosion		: [ "Fx/fxExplosion.png",	1,	1,	],	//爆発エフェクト
		flyFx			: [ "Fx/fxFly.png",			1,	1,	],	//プレイヤーエフェクト
		hitFx			: [ "Fx/fxHit.png",			2,	4,	],	//ヒットエフェクト
		preliminaryFx	: [ "Fx/fxPreliminary.png",	1,	1,	],	//予備動作エフェクト
		emitFx			: [ "Fx/fxEmit.png",		4,	2,	],	//エミットエフェクト
		touched			: [ "Fx/fxTouch.png",		4,	2,	],	//タッチエフェクト

		resetButton		: [ "Ui/btnReset.png",		1,	1,	],	//リセットボタン
		retryButton		: [ "Ui/btnRetry.png",		1,	1,	],	//リトライボタン
		shareScoreButton: [ "Ui/btnShare.png",		1,	1,	],	//結果シェアボタン
	},

	/** サウンド */
	se	: {
	},

	/** システム用 */
	sysImg	: {
		labelBg	: "Sys/labelbg.png",
	},

	/** フォント名 */
	font	: {
		talk		: "Kosugi Maru",
		distance	: "VT323",
	},

};



function GetResPath(res){return `${rc.DIRECTORY}${res[0]}`}

var g_resources = [];
for(let i in rc.sysImg)	g_resources.push(`${rc.DIRECTORY}${rc.sysImg[i]}`);
for(let i in rc.img)	g_resources.push(GetResPath(rc.img[i]));
