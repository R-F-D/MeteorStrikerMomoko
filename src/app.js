var cc;
var Scenes	= Scenes || {};

/** Scenesクラスのファクトリ */
Scenes.SceneFactory	= ()=>{
	const sceneClass	= Scenes.GamePlay;
	return sceneClass.Create();
}


//デバッグ
function isDebug(){			return !!cc.game.config[cc.game.CONFIG_KEY.debugMode];	}
function Debug(callback){	if(isDebug()) callback();	}
function Log(arg){			Debug(()=>console.log(arg));}
function Msg(arg){			Debug(()=>alert(JSON.stringify(arg)));	}

