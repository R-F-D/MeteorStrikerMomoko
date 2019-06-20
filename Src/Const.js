/********************************************************************************
	定数
********************************************************************************/
const C = (()=>{let C={}; //file scope

/** @const ローカルストレージのキー */
C.Store	= {
	GamePlay:{
		/** @const ハイスコア*/
		HighScore		: "GamePlay.HighScore",
		/** @const パーフェクト回数 */
		NumGoods		: "GamePlay.NumGoods",
		/** @const パーフェクト回数 */
		NumPerfects		: "GamePlay.NumPerfects",
		/** @const 100%パーフェクト回数 */
		NumTruePerfects	: "GamePlay.NumTruePerfects",
		/** @const エイミング精度最高値 */
		BestAiming		: "GamePlay.BestAiming",
	},
},

/** @const チェックポイント距離 */
C.CheckPoints	= [
	{	key:"Start",	distance:0,			},
	{	key:"Venus",	distance:42000000,	},
	{	key:"Mars",		distance:70000000,	},
	{	key:"Mercury",	distance:91500000,	},
	{	key:"Sun",		distance:149600000,	},
	{	key:"Kirari",	distance:186200000,	},
	{	key:"Unicorn",	distance:256000000,	},
];


return C})(); //file scope


