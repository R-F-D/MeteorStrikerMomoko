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


//デバッグ
function isDebug(){			return !!cc.game.config[cc.game.CONFIG_KEY.debugMode];	}
function Debug(callback){	if(isDebug()) callback();	}
function Log(arg){			Debug(()=>console.log(arg));}
function Msg(arg){			Debug(()=>alert(JSON.stringify(arg)));	}

