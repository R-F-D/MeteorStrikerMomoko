/********************************************************************************
	定数
********************************************************************************/
const C = (()=>{let C={}; //file scope

/** @const ローカルストレージのキー */
C.Store	= {
	GamePlay:{
		/** @const ハイスコア*/
		HighScore					: "GamePlay.HighScore",
		/** @const パーフェクト回数 */
		NumGoods					: "GamePlay.NumGoods",
		/** @const パーフェクト回数 */
		NumPerfects					: "GamePlay.NumPerfects",
		/** @const 100%パーフェクト回数 */
		NumTruePerfects				: "GamePlay.NumTruePerfects",
		/** @const エイミング精度最高値 */
		BestAiming					: "GamePlay.BestAiming",
		/** @const 強打回数 */
		NumHardBlowings				: "GamePlay.NumHardBlowings",
		/** @const 軽打回数 */
		NumLightBlowings			: "GamePlay.NumLightBlowings",
		/** @const 最高打撃力 */
		BestBlowing					: "GamePlay.BestBlowing",
		/** @const 強打とパーフェクトを同時に出した回数 */
		NumHardAndPerfectBlowings	:"GamePlay.NumHardAndPerfectBlowings",
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


