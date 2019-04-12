/** @const リソースファイル設定 */
const rc	= {
	/** リソースディレクトリ */
	DIRECTORY	: "../Res/",

	/** 画像 */
	img	: {
		bg1				: [ "bg1.png",			1,	1,	],	//背景1
		bg2				: [ "bg2.png",			1,	1,	],	//背景2
		player			: [ "msmomoko.png",		4,	2,	],	//プレイヤーキャラクター
		navigator		: [ "navigator.png",	2,	1,	],	//ナビゲータ
		aimCursor		: [ "aimcur.png",		2,	2,	],	//エイミングカーソル
		aimGauge		: [ "aimgauge.png",		1,	1,	],	//エイミングゲージ
		hitArea			: [ "hitarea.png",		1,	4,	],	//ヒット領域
		meteor			: [ "meteor.png",		1,	1,	],	//メテオ
		flare			: [ "flare.png",		1,	1,	],	//隕石エフェクト
		flyFx			: [ "flyfx.png",		1,	1,	],	//プレイヤーエフェクト
		hitFx			: [ "hitfx.png",		2,	4,	],	//ヒットエフェクト
		preliminaryFx	: [ "preliminary.png",	1,	1,	],	//予備動作エフェクト
		emitFx			: [ "emitfx.png",		4,	2,	],	//エミットエフェクト
		touched			: [ "touched.png",		4,	2,	],	//タッチエフェクト
		resetIcon		: [ "reload-icon.png",	1,	1,	],	//更新アイコン
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
		talk	: "Kosugi Maru",
	},

};


var g_resources = [];
for(let i in rc.sysImg)	g_resources.push(`${rc.DIRECTORY}${rc.sysImg[i]}`);
for(let i in rc.img)	g_resources.push(`${rc.DIRECTORY}${rc.img[i][0]}`);
