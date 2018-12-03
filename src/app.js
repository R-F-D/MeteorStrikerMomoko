var cc;
var Scenes	= Scenes || {};

/** Scenesクラスのファクトリ */
Scenes.SceneFactory	= ()=>{
	const sceneClass	= Scenes.GamePlay;
	return sceneClass.Create();
}

/** 数値を一定範囲内に収める（サイクル）
 * @param {number|number[]} value
 * @param {number} lower 下限値（以上）
 * @param {number} upper 上限値（未満）
 * @returns  {number|number[]}
 */
function Cycle(value,lower,upper){
	if(typeof lower!=="number" || typeof upper!=="number" || lower>=upper){
		throw new Error(`'${lower}' or '${upper}' is not valid.`);
	}
	//To Array
	const isArray	= Array.isArray(value);
	if(!isArray)	value	= [value];
	//サイクル処理
	value	= value.map((v)=>{
		if(typeof v !== "number")	throw new Error(`'${v}' is not a number.`);

		while(true){
			if     (v < lower)	v += upper-lower;
			else if(upper <= v)	v -= upper-lower;
			else				return v;
		}
	});
	return isArray	? value	: value[0];
}

/** 配列作成
 * @param {number} length
 * @returns {array}
 */
function CreateArray(length){
	let list	= [];
	for(let i=0; i<length; ++i)	list.push(null);
	return list;
}

//デバッグ
function isDebug(){			return !!cc.game.config[cc.game.CONFIG_KEY.debugMode];	}
function Debug(callback){	if(isDebug()) callback();	}
function Log(arg){			Debug(()=>console.log(arg));}
function Msg(arg){			Debug(()=>alert(JSON.stringify(arg)));	}

