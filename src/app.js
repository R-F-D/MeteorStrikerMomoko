var cc;
var Scenes	= Scenes || {};

/** Scenesクラスのファクトリ */
Scenes.SceneFactory	= ()=>{
	const sceneClass	= Scenes.GamePlay;
	return sceneClass.Create();
}