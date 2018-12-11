var cc;
var Scenes	= Scenes || {};

/** Scenesクラスのファクトリ */
Scenes.SceneFactory	= ()=>{
	const sceneClass	= Scenes.GamePlay;
	return sceneClass.Create();
}


/** 数値を一定範囲内に収める（サイクル）
 * @param {number} value 対象の値
 * @param {number} lower 下限値（以上）
 * @param {number} upper 上限値（未満）
 * @returns  {number}
 */
function Cycle(value,lower,upper){
	if(typeof value !== "number" || typeof lower!=="number" || typeof upper!=="number" || lower>=upper){
		throw new Error(`'${value}' or ${lower}','${upper}' is not valid.`);
	}

	while(true){
		if     (value < lower)	value += upper-lower;
		else if(upper <= value)	value -= upper-lower;
		else					return value;
	}
}

/** 配列の全ての数値を一定範囲内に収める（サイクル）
 * @param {number} value 対象の値
 * @param {number} lower 下限値（以上）
 * @param {number} upper 上限値（未満）
 * @returns {number[]}
 */
Array.prototype.Cycle	= function(lower,upper){
	return this.map(v=>Cycle(v,lower,upper));
}

/** 数値を一定範囲内に収める（クランプ）
 * @param {number} value 対象の値
 * @param {number} [lower=null] 下限値（以上）
 * @param {number} [upper=null] 上限値（以下）
 * @returns {number} 新しい値
 */
function Clamp(value,lower=null,upper=null){
	//Swap
	if(lower!=null && upper!=null && upper<lower) [upper,lower] = [lower,upper];
	//クランプ処理
	if     (lower!=null && value<lower)	return lower;
	else if(upper!=null && value>upper)	return upper;
	return value;
}

/** 配列の全ての数値を一定範囲内に収める（クランプ）
 * @param {number[]} value 対象の値
 * @param {number} [lower=null] 下限値（以上）
 * @param {number} [upper=null] 上限値（以下）
 * @returns {number[]} 新しい値
 */
Array.prototype.Clamp	= function(lower=null,upper=null){
	return this.map(v=>Clamp(v,lower,upper));
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


/** 正規乱数
 * @param {number} halfWidth 半幅
 * @returns {number}
 */
function NormalRandom(halfWidth){
	return (Math.random()+Math.random()-1) * halfWidth;
}

//デバッグ
function isDebug(){			return !!cc.game.config[cc.game.CONFIG_KEY.debugMode];	}
function Debug(callback){	if(isDebug()) callback();	}
function Log(arg){			Debug(()=>console.log(arg));}
function Msg(arg){			Debug(()=>alert(JSON.stringify(arg)));	}

