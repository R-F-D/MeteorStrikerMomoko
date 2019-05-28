/********************************************************************************
	定数
********************************************************************************/
const C = (()=>{let C={}; //file scope

/** @const ローカルストレージのキー */
C.Store	= {
	/** @const ハイスコア*/
	HighScore:	"HighScore",
},

/** @const チェックポイント距離 */
C.CheckPoints	= [
	{	key:"Start",	distance:0,			},
	{	key:"Venus",	distance:42000000,	},
	{	key:"Mars",		distance:42000000,	},
	{	key:"Mercury",	distance:91500000,	},
	{	key:"Sun",		distance:149600000,	},
	{	key:"Kirari",	distance:186200000,	},
	{	key:"Unicorn",	distance:256000000,	},
];


return C})(); //file scope


