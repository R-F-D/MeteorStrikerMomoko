const rc	= {
	"img"	: {
		"player"	: [ "player.png",	2,	1,	],
		"aimCursor"	: [ "aimcur.png",	1,	1,	],
		"aimGauge"	: [ "aimgauge.png",	1,	1,	],
	},
	"se"	: {
	},
};


var g_resources = [];
for(let i in rc.img) {
	g_resources.push("../res/"+rc.img[i][0]);
}
