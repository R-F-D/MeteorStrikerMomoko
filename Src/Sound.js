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

		this.musicHandles		= {};
		this.playingMusicHandle	= null;
	}

	/** 初期化処理
	 * - 自動再生ブロックへの対応のため音量0で再生
	 * - Init()前後に画面をクリック/タップさせるような構成にすること */
	Init(){
		this.playsBgm	= !!Store.Select(Store.Handles.Settings.PlaysBgm,"1").Number();

		if(this.musicIsInitialized)	return this;

		//全BGMを音量0で再生してミュージックハンドルに格納
		if(this.playsBgm){
			cc.audioEngine.setMusicVolume(0);
			_(rc.bgm).forEach(filename=>{
				this.musicHandles[filename]	= cc.audioEngine.playMusic(`${rc.DIRECTORY}Bgm/${filename}`,true);
				cc.audioEngine.pauseMusic(this.musicHandles[filename]);
			});
			cc.audioEngine.setMusicVolume(this.musicVolume);
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

		this.StopMusic();
		this.playingMusicHandle	= this.musicHandles[filename];
		cc.audioEngine.rewindMusic(this.playingMusicHandle);
//		cc.audioEngine.resumeMusic(this.playingMusicHandle);

		return this;
	}

	/** BGM停止 */
	StopMusic(musicHandle=this.playingMusicHandle){
		if(musicHandle!==null)	cc.audioEngine.pauseMusic(musicHandle);
		return this;
	}

}

const sound = new Sound();

