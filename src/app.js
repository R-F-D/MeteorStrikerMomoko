var cc;
var Scenes	= Scenes || {};

/** Scenesクラスのファクトリ */
Scenes.SceneFactory	= ()=>{
	const sceneClass	= Scenes.GamePlay;
	return sceneClass.Create();
}

/** 配列のいずれかの要素に該当するなら真
 * @param {*} one
 * @param {Array} list
 * return boolean
 */
function IsAnyOf(one,list){
	return list.indexOf(one) >= 0;
}

function debug(arg){
	console.log(arg);
}
