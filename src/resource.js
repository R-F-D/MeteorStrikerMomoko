/** @const リソースファイル設定 */
const rc	= {
	/** リソースディレクトリ */
	DIRECTORY	: "../res/",

	/** 画像 */
	img	: {
		"player"	: [ "player.png",	2,	1,	],	//プレイヤーキャラクター
		"aimCursor"	: [ "aimcur.png",	1,	1,	],	//エイミングカーソル
		"aimGauge"	: [ "aimgauge.png",	1,	1,	],	//エイミングゲージ
	},

	/** サウンド */
	se	: {
	},
};


var g_resources = [];
for(let i in rc.img) {
	g_resources.push(`${rc.DIRECTORY}${rc.img[i][0]}`);
}
