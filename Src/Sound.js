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
		this.playsBgm		= false;
	}

	/** 初期化処理
	 * - 自動再生ブロックへの対応のため音量0で再生
	 * - Init()前後に画面をクリック/タップさせるような構成にすること */
	Init(){
		this.playsBgm	= !!Store.Select(Store.Handles.Settings.PlaysBgm,"1").Number();

		if(this.musicIsInitialized)	return this;

		//音量0でBGMを再生してみる
		if(this.playsBgm){
			cc.audioEngine.setMusicVolume(0);
			cc.audioEngine.playMusic(`${rc.DIRECTORY}Bgm/${rc.bgm.meteorite}`,false);
			cc.audioEngine.stopMusic();
			cc.audioEngine.setMusicVolume(this.musicVolume);
			this.musicIsInitialized	= true;
		}

		return this.Reset();
	}

	/** サウンドのリセット
	 * @memberof Sound
	 */
	Reset(){
		this.StopMusic();
		return this;
	}

	/** BGM再生 */
	PlayMusic(path){
		if(!this.playsBgm || !this.musicIsInitialized)	return this;

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

