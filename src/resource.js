
const res	= {
	"img"	: {
		"player"	: { path:"res/player.png",	width:96,	height:48,	nSplitX:2,	nSplitY:1,	},
	},
	"se"	: {
	},
};


var g_resources = [];
for(let i in res.img) {
	g_resources.push(res.img[i].path);
}
