/* *******************************************************************************
	Titleシーン
********************************************************************************/
var Scene	= Scene || {};
(function(){	//File Scope

/** classへのthis */
let _this	= null;

/** シークエンス列挙型 */
let Sequences	= {
	/**初期状態*/		INITIAL			: null,
};
/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: "Title.Main",
};

Scene.Title	= class extends Scene.SceneBase {

	constructor(){
		super();
		_this	= this;

		/** ccSceneのインスタンス */
		this.ApplicateCcSceneInstance(this).InitLayerList();

		//シークエンス設定
		for(let i in Sequences){ Sequences[i] = Scene.Sequence.Create() }
		this.SetSequenceFunctions().InitEventListenerList();
	}


	/** ccLayerに渡す用 */
	InitLayerList(){
		super.InitLayerList()
			.AddToLayerList("main",{
				ctor:function(){
					this._super();
					this.init();
					this.scheduleUpdate();
					return true;
				},
				init	: function(){
					this._super();
					const size	= cc.director.getWinSize();
					_this.sprites.bg		= CreateArray(2).map(i=> Sprite.CreateInstance(rc.img.bg1).AddToLayer(this).SetVisible(true)	);
					_this.sprites.logo		= Sprite.CreateInstance(rc.img.logo).AddToLayer(this).SetScale(1).Attr({zIndex:0}).SetPositionLT(0,size.height);
					_this.sprites.player	= Sprite.CreateInstance(rc.img.player).AddToLayer(this).SetScale(2).Attr({zIndex:5}).SetPosition(128,64).SetRotate(-5).SetCustomData("adjY").SetCustomData("dy");;
					return true;
				},
				update	: function(dt){
					this._super();

					const width		= cc.director.getWinSize().width;
					const bgWidth	= _this.sprites.bg[0].GetPieceSize().width;
					_this.sprites.bg.forEach((v,i)=>{
						v.SetPosition(	width /2 - Cycle(_this.count*4, 0, bgWidth) + bgWidth*i,	256);
					});

					let adjY	= _this.sprites.player.GetCustomData("adjY",+100);	//修正
					let dy		= _this.sprites.player.GetCustomData("dy",  -3);		//増分
					dy += adjY < 0	? 0.01	: -0.01;
					if     (dy <-0.25) dy = MoveTo(dy,-0.25,0.05);
					else if(dy > 0.25) dy = MoveTo(dy, 0.25,0.05);
					adjY += dy;
					

					_this.sprites.player
						.SetIndex(Math.trunc(_this.count/8)%2+4)
						.SetPosition(128,64+adjY).SetCustomData("adjY",adjY).SetCustomData("dy",dy);
					return true;
				},
			});
		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット
		this.InitSequence(Sequences.INITIAL,Sequences,this.ccLayerInstances[LinkedLayerTags.MAIN]);
		this.sequence.Init()
		return this;
	}

}//class

})();	//File Scope

