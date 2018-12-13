/** @const リソースファイル設定 */
const rc	= {
	/** リソースディレクトリ */
	DIRECTORY	: "../res/",

	/** 画像 */
	img	: {
		bg1			: [ "bg1.png",		1,	1,	],	//背景1
		bg2			: [ "bg2.png",		1,	1,	],	//背景2
		player		: [ "msmomoko.png",	4,	2,	],	//プレイヤーキャラクター
		aimCursor	: [ "aimcur.png",	2,	2,	],	//エイミングカーソル
		aimGauge	: [ "aimgauge.png",	1,	1,	],	//エイミングゲージ
		meteor		: [ "meteor.png",	1,	1,	],	//メテオ
		flare		: [ "flare.png",	1,	1,	],	//隕石エフェクト
		flyFx		: [ "flyfx.png",	1,	1,	],	//プレイヤーエフェクト
	},

	/** サウンド */
	se	: {
	},
};


var g_resources = [];
for(let i in rc.img) {
	g_resources.push(`${rc.DIRECTORY}${rc.img[i][0]}`);
}
