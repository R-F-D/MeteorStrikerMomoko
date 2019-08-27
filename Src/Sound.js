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

	/** 初期化処理
	 * - 自動再生ブロックへの対応のため音量0で再生
	 * - Init()前後に画面をクリック/タップさせるような構成にすること */
	Init(){
		if(this.musicIsInitialized)	return this;

		//音量0でBGMを再生してみる
		cc.audioEngine.setMusicVolume(0);
		cc.audioEngine.playMusic(`${rc.DIRECTORY}Bgm/${rc.bgm.meteorite}`,false);
		cc.audioEngine.stopMusic();
		cc.audioEngine.setMusicVolume(this.musicVolume);
		this.musicIsInitialized	= true;

		return this.Reset();
	}

	/** サウンドのリセット
	 * @memberof Sound
	 */
	Reset(){
		if(!this.musicIsInitialized)	return this;
		this.StopMusic();
		return this;
	}

	/** BGM再生 */
	PlayMusic(path){
		cc.audioEngine.playMusic(`${rc.DIRECTORY}Bgm/${path}`,true);
		return this;
	}

	/** BGM停止 */
	StopMusic(){
		cc.audioEngine.stopMusic();
		return this;
	}

}

const sound = new Sound();

