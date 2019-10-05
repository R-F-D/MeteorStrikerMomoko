/* *******************************************************************************
	サウンド管理
********************************************************************************/
var cc,_;
var rc;
var Store;

/** サウンド管理
 * @class Sound
 */
class Sound{

	constructor(){
		this.musicIsInitialized	= false;
		this.musicVolume	= 1.0;
		this.playsBgm		= false;

		this.musicHandles		= {};
	}

	/** 初期化処理
	 * - 自動再生ブロックへの対応のため音量0で再生
	 * - Init()前後に画面をクリック/タップさせるような構成にすること */
	Init(){
		this.playsBgm	= !!Store.Select(Store.Handles.Settings.BgmVolume,"1").Number();

		if(this.musicIsInitialized)	return this;

		//全BGMを音量0で再生してミュージックハンドルに格納
		if(this.playsBgm){
			cc.audioEngine.setMusicVolume(0);
			_(rc.bgm).forEach(filename=>{
				cc.audioEngine.playMusic(`${rc.DIRECTORY}Bgm/${filename}`,true);
				this.musicHandles[filename]	= cc.audioEngine._currMusic;
				this.musicHandles[filename].pause();
			});
			this.musicIsInitialized	= true;
		}

		return this.Reset();
	}

	/** サウンドのリセット
	 * @memberof Sound
	 */
	Reset(){
		_(this.musicHandles).forEach(h=>this.StopMusic(h));
		return this;
	}

	/** BGM再生 */
	PlayMusic(filename){
		if(!this.playsBgm || !this.musicIsInitialized)	return this;

		this.Reset();
		if(this.musicHandles[filename]){
			this.musicHandles[filename].stop();
			this.musicHandles[filename].play();
//			this.musicHandles[filename].setVolume(_(this.musicVolume).clamp(0.0,1.0));
		}
		else{
			cc.audioEngine.rewindMusic();
//			cc.audioEngine.setMusicVolume(this.musicVolume);
		}
		this.LoadVolumeSettings();

		return this;
	}

	/** BGM停止 */
	StopMusic(musicHandle=null){
		if(musicHandle)	musicHandle.pause();
		else			cc.audioEngine.pauseMusic();
		return this;
	}

	/**ダミーBGM*/
	PlayDummyMusic(){
		cc.audioEngine.playMusic(`${rc.DIRECTORY}/${rc.sysAudio.void}`,true);
		cc.audioEngine.setMusicVolume(0);
		return this;
	}

	/**BGM音量*/
	SetMusicVolume(volume){
		this.musicVolume	= _(volume).clamp(0.0, 1.0);
		_(this.musicHandles).forEach(h=>h.setVolume(this.musicVolume));
		cc.audioEngine.setMusicVolume(this.musicVolume);
		return this;
	}

	/**音量設定を読み込む*/
	LoadVolumeSettings(){
		this.SetMusicVolume( _(Store.Select(Store.Handles.Settings.BgmVolume,"3").Number()).clamp(0,5)*0.2	);
		return this;
	}

}

// eslint-disable-next-line no-unused-vars
var sound	= new Sound();

