/* *******************************************************************************
	サウンド管理
********************************************************************************/

/** サウンド管理
 * @class Sound
 */
class Sound{

	constructor(){
		this.musicIsInitialized	= false;
		this.musicVolume	= 1.0;
	}

	Init(){
		if(this.musicIsInitialized)	return this;

		cc.audioEngine.setMusicVolume(0);
		cc.audioEngine.playMusic(`${rc.DIRECTORY}Bgm/${rc.bgm.meteorite}`,false);
		cc.audioEngine.stopMusic();
		cc.audioEngine.setMusicVolume(this.musicVolume);
		this.musicIsInitialized	= true;

		return this;
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

