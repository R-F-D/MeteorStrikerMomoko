/* *******************************************************************************
	Recordsシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN:	"Records.Main",
	BG:		"Records.Bg",
	UI:		"Records.Ui",
};


Scene.Records	= class extends Scene.SceneBase {

	constructor(){
		super();

		this.Sequences	= {
			INITIAL:		null,	//初期状態
			RECORDS:		null,	//記録一覧
			ACHIEVEMENTS:	null,	//実績一覧
		};

		this.sprites	= {};
		this.buttons	= {};
		this.labels		= {};

		/** ccSceneのインスタンス */
		this.ApplicateCcSceneInstance(this).InitLayerList();

		//シークエンス設定
		for(let i in this.Sequences){ this.Sequences[i] = Scene.Sequence.Create() }
		this.SetSequenceFunctions().InitEventListenerList();
	}


	/** ccLayerに渡す用 */
	InitLayerList(){
		const _this	= this;
		super.InitLayerList()
			.AddToLayerList("main",{
				ctor:function(){
					this._super();
					this.scheduleUpdate();

					//Labels
					_this.labels.records	= _.range( Store.GetVisibleHandles().length )
												.map( l=>	Label.CreateInstance(11).AddToLayer(this).SetBgEnabled(true) );

					return true;
				},
			})
			.AddToLayerList("bg",{
				ctor:function(){
					this._super();
					this.scheduleUpdate();
					_this.sprites.bg	= _.range(2).map(i=> Sprite.CreateInstance(rc.img.bgGround).AddToLayer(this).SetVisible(true) );
					return true;
				},
				update	: function(dt){
					this._super();
					const width		= cc.director.getWinSize().width;
					const bgWidth	= _this.sprites.bg[0].GetPieceSize().width;
					_this.sprites.bg.forEach((v,i)=>v.SetPosition(	width /2 - Cycle(_this.count, 0, bgWidth) + bgWidth*i,	256) );
				},
			})
			.AddToLayerList("ui",{
				ctor:function(){
					this._super();
					this.scheduleUpdate();

					//ボタン
					_this.buttons	= Button.CreateInstance(1).AddToLayer(this);
					_this.buttons.at(0).CreateSprite(rc.img.navigationButton).SetTag("Reset");

					return true;
				},
				update	: function(dt){
					this._super();
					_this.buttons.Update(dt);
					_this.sequence.Update(dt,"layer-ui");
				},
			});
		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.SetLayer(LinkedLayerTags.UI,  this.ccLayers.ui,  0x0002)
			.SetLayer(LinkedLayerTags.BG,  this.ccLayers.bg,  0x0000)
			.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット

		this.InitSequences(this.Sequences,LinkedLayerTags.MAIN,this.ccLayerInstances[LinkedLayerTags.MAIN])
			.SetSequence(this.Sequences.INITIAL);

		return this;
	}

	OnUpdating(dt){
		super.OnUpdating(dt);
		this.labels.records.forEach( label=>label.Update(dt) );
		return this;
	}

	SetSequenceFunctions(){
		const size		= cc.director.getWinSize();

		//初期状態
		this.Sequences.INITIAL.PushStartingFunctions(()=>{
			//ラベル
			this.labels.records
				.forEach(label=> label.Init().SetColor("FFFFFF").SetNumLogLines(2) );

			//インタフェース
			this.buttons.at("Reset")
				.SetVisible(true)
				.SetPosition(16,size.height-16)
				.SetColorOnHover([0xFF,0xA0,0x00])
				.OnButtonUp(()=>this.ResetForce());
		})
		.PushUpdatingFunctions(dt=>{
			 if(this.sequence.count>=30) this.SetSequence(this.Sequences.RECORDS);
		});
		//スコア表示
		this.Sequences.RECORDS.PushStartingFunctions(()=>{

			const handles	= Store.GetVisibleHandles(0);

			//ラベル
			this.labels.records
				.forEach((label,i)=>{
					if(i>=handles.length){
						label.SetVisible(false);
						return;
					}

					//テキスト
					const text		= L.Text(`Records.${handles[i].Key}`);
					const count		= L.NumToStr( Number(cc.sys.localStorage.getItem(handles[i].Key)), handles[i].nDecimalDigits );
					let patterns	= [count];
					if(L.TextExists(handles[i].UnitKey))	patterns.push(L.Text(handles[i].UnitKey));
					const fmtCount	= !L.TextExists(`Records.${handles[i].Key}.Format`) ? `${count}` : L.Textf( `Records.${handles[i].Key}.Format`, patterns );

					const x	= (i%2) * (160+4);
					const y	= Math.trunc(i/2) * (32+4);
					label.bg.lower	= {width:160, height:32};
					label
						.SetVisible(true)
						.SetAnchorPoint(0.0, 0.5)
						.SetPosition(96+x,240-y)
						.SetString(`${text}\n${fmtCount}`);
				});
		})
		.PushUpdatingFunctions(dt=>{
		});
		return this;
	}

	InitEventListenerList(){
		super.InitEventListenerList();

		//共通イベント対応設定
		let commonEvents	= [];
		commonEvents.push(this.listeners.touched);
		Debug(()=>commonEvents.push(this.listeners.reset));
		this.SetCommonEventListeners("SceneBase.TouchFx",commonEvents);

		return this;
	}

}//class

})();	//File Scope

