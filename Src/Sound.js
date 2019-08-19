/* *******************************************************************************
	サウンド管理
********************************************************************************/

/** サウンド管理
 * @class Sound
 */
class Sound{

	constructor(){
	}

	PlayMusic(path){
		cc.audioEngine.playMusic(`${rc.DIRECTORY}Bgm/${path}`,true);
		return this;
	}

	StopMusic(){
		cc.audioEngine.stopMusic();
		return this;
	}

}

const sound = new Sound();

