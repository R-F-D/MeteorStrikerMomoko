const rc	= {
	"img"	: {
		"player"	: [ "res/player.png",	2,	1,	],
		"aimCursor"	: [ "res/aimcur.png",	1,	1,	],
		"aimGauge"	: [ "res/aimgauge.png",	1,	1,	],
	},
	"se"	: {
	},
};


var g_resources = [];
for(let i in rc.img) {
	g_resources.push(rc.img[i][0]);
}
