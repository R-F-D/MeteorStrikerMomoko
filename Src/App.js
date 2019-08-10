var cc;
var Scene	= Scene || {};

/** Scenesクラスのファクトリ */
Scene.SceneFactory	= ()=>{
	Scene.SceneBase.first	= Scene.Title;
	Scene.SceneBase.resetTo	= Scene.Title;
	return Scene.SceneBase.first.Create();
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
 * @param {number} [lower=null] 下限値（以上）
 * @param {number} [upper=null] 上限値（以下）
 * @returns {number[]} 新しい値
 */
Array.prototype.Clamp	= function(lower=null,upper=null){
	return this.map(v=>Clamp(v,lower,upper));
}

/** 値を一定値に近づける
 * @param {number} src 現在値
 * @param {number} dest 目標値
 * @param {number} [distance=1] 変化量
 * @returns {number} 新しい値
 */
function MoveTo(src,dest,distance=1){
	if(distance <= 0)	return src;

	else if(src < dest)	return Math.min( src+distance, dest );
	else if(src > dest)	return Math.max( src-distance, dest );
	else				return dest;
}

/** 配列の全ての値を一定値に近づける
 * @param {number} dest 目標値
 * @param {number} [distance=1] 変化量
 * @returns {number[]} 新しい値
 */
Array.prototype.MoveTo	= function(dest,distance=1){
	return this.map(v=>MoveTo(v,dest,distance));
}

/** 配列作成
 * @param {number} length
 * @param {number} [isNumbering=null] 値を連番にする
 * @returns {array}
 */
function CreateArray(length,isNumbering=null){
	let list	= [];
	for(let i=0; i<length; ++i)	list.push( isNumbering ? i : null );
	return list;
}

/** null時やundefined時に値を切り替える
 * @param {*} value			基準となる変数
 * @param {*} valueNull		null時の値
 * @param {*} valueUndef	undefined時の値
 * @returns value、ないしnull/undefine時はそれぞれの値
 */
function DefinedOr(value,valueNull,valueUndef){
	if(value===undefined)	return valueUndef;
	else if(value===null)	return valueNull;
	else					return value;
}

/** 正規乱数
 * @param {number} halfWidth 半幅
 * @returns {number}
 */
function NormalRandom(halfWidth){
	return (Math.random()+Math.random()-1) * halfWidth;
}

/** ランダムな角度を出力する
 * @param {number} [piradRange=2]			出力する範囲。単位はπrad。省略すると2（2πrad=360°）。
 * @param {number} [piradStandardAngle=0]	出力範囲の中央となる値。単位はπrad。省略すると0。
 * @returns {number} 						単位はrad
 */
function GetRandamAngle(piradRange=2,piradStandardAngle=0){
	let pirad	= Math.random() * piradRange - piradRange/2 + piradStandardAngle;
	return Cycle(pirad,0,2) * Math.PI;
}

/** エポックミリ秒をエポック日数に変換
 * @param {number} ms					エポックミリ秒
 * @param {number} [hourOffset=null]	ローカル時間から見た。時差+9時間なら省略時は自動検出。
 * @returns
 */
function EpochMsecToEpochDay(msec,hourOffset=null){
	const msOffset	= (hourOffset!==null ? hourOffset : (new Date()).getTimezoneOffset())	* 60*1000;
	return Math.trunc( (msec-msOffset) / (24*60*60*1000) );
}

/** エポック日数を得る
 * @returns
 */
Date.prototype.ToEpochDay	= function(){
	return EpochMsecToEpochDay(this.getTime(), this.getTimezoneOffset());
}

String.prototype.Number	= function(){return Number(this)}
String.prototype.Int	= function(){return Math.trunc(Number(this))}

//デバッグ
function isDebug(){			return !!cc.game.config[cc.game.CONFIG_KEY.debugMode];	}
function Debug(callback){	if(isDebug()) callback();	}
function Msg(arg){			Debug(()=>alert(JSON.stringify(arg)));	}
function Log(arg){Debug(()=>{
	const date = new Date();
	console.log(`[${date.toLocaleTimeString()}.${(date.getMilliseconds()/1000).toFixed(3).slice(2,5)}] ${arg}`);
})}

