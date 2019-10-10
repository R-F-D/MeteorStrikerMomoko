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
		this.effectIsInitialized	= false;
		this.musicIsInitialized		= false;
		this.effectVolume	= 1.0;
		this.musicVolume	= 1.0;

		this.effectHandles		= {};
		this.musicHandles		= {};
	}

	/** 初期化処理
	 * - 自動再生ブロックへの対応のため音量0で再生
	 * - Init()前後に画面をクリック/タップさせるような構成にすること */
	Init(){
		//音量データ読み込み
		this.LoadVolumeSettings();

		if(!this.effectIsInitialized)	this._InitEffect();
		if(!this.musicIsInitialized)	this._InitMusic();
		return this.Reset();
	}

	/**全効果音を音量0で再生してSFXハンドルに格納*/
	_InitEffect(){
		if(!this.playsFx)	return this;

		cc.audioEngine.setEffectsVolume(0);
		_(rc.sfx).forEach(filename=>{
			this.effectHandles[filename]	= cc.audioEngine.playEffect(`${rc.DIRECTORY}Sfx/${filename}`,false);
		});
		this.effectIsInitialized	= true;

		return this;
	}

	/**全BGMを音量0で再生してミュージックハンドルに格納*/
	_InitMusic(){
		if(!this.playsBgm)	return this;

		cc.audioEngine.setMusicVolume(0);
		_(rc.bgm).forEach(filename=>{
			cc.audioEngine.playMusic(`${rc.DIRECTORY}Bgm/${filename}`,true);
			this.musicHandles[filename]	= cc.audioEngine._currMusic;
			this.musicHandles[filename].pause();
		});
		this.musicIsInitialized	= true;

		return this;
	}

	/** サウンドのリセット
	 * @memberof Sound
	 */
	Reset(){
		_(this.musicHandles).forEach(h=>this.StopMusic(h));
		return this;
	}

	Play(filename){
		if(!this.playsFx || !this.effectIsInitialized)	return this;

		cc.audioEngine.setEffectsVolume(this.effectVolume);
		cc.audioEngine.playEffect(`${rc.DIRECTORY}Sfx/${filename}`,false);
		return this;
	}

	/** BGM再生 */
	PlayMusic(filename){
		if(!this.playsBgm || !this.musicIsInitialized)	return this;

		this.Reset();
		if(this.musicHandles[filename]){
			this.musicHandles[filename].stop();
			this.musicHandles[filename].play();
		}
		else{
			cc.audioEngine.rewindMusic();
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

	get playsFx()	{ return this.effectVolume > 0 }
	get playsBgm()	{ return this.musicVolume > 0 }

}

// eslint-disable-next-line no-unused-vars
var sound	= new Sound();

