
const res	= {
	"img"	: {
		"player"	: [ "res/player.png",	2,	1,	],
	},
	"se"	: {
	},
};


var g_resources = [];
for(let i in res.img) {
	g_resources.push(res.img[i][0]);
}
