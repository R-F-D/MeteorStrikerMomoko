/** @const リソースファイル設定 */
const rc	= {
	/** リソースディレクトリ */
	DIRECTORY	: "../res/",

	/** 画像 */
	img	: {
		bg			: [ "bg.png",		1,	1,	],	//背景
		player		: [ "player.png",	2,	1,	],	//プレイヤーキャラクター
		aimCursor	: [ "aimcur.png",	2,	2,	],	//エイミングカーソル
		aimGauge	: [ "aimgauge.png",	1,	1,	],	//エイミングゲージ
		meteor		: [ "meteor.png",	1,	1,	],	//メテオ
	},

	/** サウンド */
	se	: {
	},
};


var g_resources = [];
for(let i in rc.img) {
	g_resources.push(`${rc.DIRECTORY}${rc.img[i][0]}`);
}
