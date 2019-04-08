/* *******************************************************************************
	GamePlayシーン
********************************************************************************/
var Scenes	= Scenes || {};
(function(){	//File Scope

/** classへのthis */
let _this	= null;
/** シークエンス列挙型 */
let Sequences	= {
	/**初期状態*/		INITIAL			: null,
	/**エイム作動*/		START_AIM		: null,
	/**打撃予備動作*/	PRELIMINARY		: null,
	/**打撃動作*/		DISCHARGE		: null,
	/**エミット中*/		EMIT			: null,
	/**吹き飛ばし*/		BLOW_AWAY		: null,
	/**測定中*/			MEASURE			: null,
	/**動作失敗*/		DISCHARGE_FAILED: null,
};
/** 打撃定数 */
const BlowPower	= {
	/**下限値*/			MIN				: -30*256,
	/**上限値*/			MAX				: 60*256,
	/**初期値*/			INITIAL			: 0,
	/**増分*/			INCREMENT		: 1*256,
	/**失敗時の減少*/	DECREMENT		: 1*256,
	/**主動作の速度*/	DISCHARGE_SPEED	: 4*256,
	/**主動作の加速度*/	ACCELERATION	: 1.20,
};
/** エミットエナジー定数*/
const EmitEnergy	= {
	/**エミット受付期間*/	ACCEPTION_COUNT		: 300,
	/**エミット加算値*/		ADDITIONAL_POWER	: 128,
};
/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: "GamePlay.Main",
	BG		: "GamePlay.Bg",
};

Scenes.GamePlay	= class extends Scenes.SceneBase {

	constructor(){
		super();
		_this					= this;

		/** @var 座標 */
		this.POSITIONS	= {
			PLAYER	: {	X:96,	Y:96,	},
			METEOR	: {	X:192,	Y:144,	},
		};

		//インパクトシークエンス
		/** @var チャージ時間 */
		this.chargingCount		= BlowPower.INITIAL;
		/** @var チャージ量 */
		this.chargedPower		= 0;
		/** 打撃動作のアニメーション速度 */
		this.dischargeSpeed		= 0;
		/** @var エイミングゲージ */
		this.aiming				= null;

		//エミットエナジーシークエンス
		/** @var エミット受付時間*/
		this.acceptEmitting		= 0;
		/** @var エミットカウンタ */
		this.nEmits	= {
			/**合計 */		total		: 0,
			/**同時*/		simul		: 0,
			/**同時最大*/	maxSimul	: 1,
		};

		//背景スクロール
		this.bgScroll		= 0;
		this.bgScrollSpeed	= -8;

		//結果表示用
		/** @var インパクト時の威力*/
		this.impactPower		= 0;
		/** @var 最終的に与えられた威力 */
		this.totalPower			= 0;
		/** @var 隕石の移動距離 */
		this.distanceOfMeteor	= 0;
		this.isOnGround			= true;

		/** ccSceneのインスタンス */
		this.ApplicateCcSceneInstance(this).InitLayerList();		

		/** ラベル */
		this.labels	= {
			aimingResult:null, hitArea:null, distance:null,	navigation:null,
		}

		//シークエンス設定
		for(let i in Sequences){ Sequences[i] = Sequence.Create() }
		this.SetSequenceFunctions().InitEventListenerList();
	}


	/** シーケンス毎の処理を定義
	 * @returns this
	 */
	SetSequenceFunctions(){

		//初期状態
		Sequences.INITIAL.PushStartingFunctions(()=>{
			this.bgScroll			= 0;
			this.bgScrollSpeed		= -8;
			this.chargingCount		= BlowPower.INITIAL;
			this.chargedPower		= 0;
			this.dischargeSpeed		= 0;
			this.distanceOfMeteor	= 0;
			this.sprites.meteor.SetVisible(true);
			this.sprites.player.SetCustomData("adjY",-100).SetCustomData("dy",3);
			this.playerEffect.SetVelocity(-1,-0.5,0.5,0);
			this.meteorEffect.SetVelocity(8,3);
			this.meteorEffect.SetColor();
			this.labels.aimingResult.SetVisible(false);
			this.labels.hitArea.SetVisible(false);
			this.labels.distance.SetVisible(false);
			this.labels.navigation.Init().SetVisible(false);

			const size	= cc.director.getWinSize();
			for(let s of this.sprites.bg1)	s.SetPosition(0,512/2).SetOpacity(255).SetVisible(true);
			for(let s of this.sprites.bg2)	s.SetPosition(0,size.height/2).SetOpacity(255).SetVisible(false);
			this.aiming.SetVisible(false);
		})
		.PushUpdatingFunctions((dt)=>{
			this.aiming.Update(false);
			if(this.sequence.count > 60)	this.SetSequence(Sequences.START_AIM);
		});

		//エイム作動
		Sequences.START_AIM
			.PushStartingFunctions(()=>{
				this.labels.navigation.SetString(L.Text("GamePlay.Navigator.1")).SetVisible(true);
				this.aiming.SetVisible(true,true);
			})
			.PushUpdatingFunctions((dt)=>{
				this.aiming.Update();
			});

		//打撃予備動作
		Sequences.PRELIMINARY
		//	.PushStartingFunctions(()=>{})
			.PushUpdatingFunctions((dt)=>{
				this.aiming.Update();
				this.chargingCount += BlowPower.INCREMENT;
				if(this.chargingCount > BlowPower.MAX)	this.SetSequence(Sequences.DISCHARGE_FAILED);
			});

		//打撃動作
		Sequences.DISCHARGE
			.PushStartingFunctions(()=>{
				this.chargedPower	= this.chargingCount;
				this.dischargeSpeed	= BlowPower.DISCHARGE_SPEED;
			})
			.PushUpdatingFunctions((dt)=>{
				this.aiming.Update();
				this.dischargeSpeed *= BlowPower.ACCELERATION;
				this.chargingCount -= this.dischargeSpeed;
				if(this.chargingCount < BlowPower.MIN){
					this.SetSequence(Sequences.EMIT);
				}
			});

		//打撃動作失敗
		Sequences.DISCHARGE_FAILED
		//	.PushStartingFunctions(()=>{})
			.PushUpdatingFunctions((dt)=>{
				this.aiming.Update();
				this.chargingCount-=BlowPower.DECREMENT;
				if(this.chargingCount < 0)	this.SetSequence(Sequences.START_AIM);
			});

		//エミット中
		Sequences.EMIT
			.PushStartingFunctions(()=>{
				this.nEmits.simul		= 0;
				this.nEmits.maxSimul	= 1;
				this.acceptEmitting		= EmitEnergy.ACCEPTION_COUNT;
				this.nEmits.total		= 0;

				this.labels.aimingResult.SetVisible(true);
				this.labels.hitArea.SetVisible(true);

				this.playerEffect.SetVelocity(+1,+0.5,-2,-1);
				this.meteorEffect.SetVelocity(-8,-4).SetColor("#FFFF00");
			})
			.PushUpdatingFunctions((dt)=>{
				this.aiming.Update(false);

				this.acceptEmitting--;
				if(this.acceptEmitting < 0)	this.SetSequence(Sequences.BLOW_AWAY);

				//マルチタッチ検出
				this.nEmits.maxSimul	= Math.max(this.nEmits.simul,this.nEmits.maxSimul);
				this.nEmits.simul		= 0;
			});

		//吹き飛ばし
		Sequences.BLOW_AWAY
			.PushStartingFunctions(()=>{
				this.impactPower		= this.GetChargingRate() * this.aiming.GetTotalRate();
				this.totalPower			= this.GetEmittingRate() * this.impactPower + 10;
				this.distanceOfMeteor	= 0;

				for(let s of this.sprites.bg2)	s.SetVisible(true);
				this.aiming.SetVisible(false);
				this.labels.aimingResult.SetVisible(false);
				this.labels.hitArea.SetVisible(false);
				this.labels.distance.SetVisible(true);
			})
			.PushUpdatingFunctions((dt)=>{
				this.aiming.Update(false);

				this.distanceOfMeteor+= 0.2+NormalRandom(0.05);
				if(this.totalPower <= this.distanceOfMeteor)	this.SetSequence(Sequences.MEASURE);
			})
			.PushUpdatingFunctions("layer-bg", (dt)=>{
				for(let sprite of this.sprites.bg1){
					sprite
						.SetRelativePosition(null,-4)
						.SetOpacity(Math.max(0,255-this.sequence.count*4));
				}
			});

		//計測中
		Sequences.MEASURE
			.PushStartingFunctions(()=>{
				for(let s of this.sprites.bg1)	s.SetVisible(false);
				this.sprites.meteor.SetVisible(false);
				this.explosionEffect.Spawn(this.sprites.meteor.x,this.sprites.meteor.y);

				Log(`Emit: ${this.nEmits.total}c, ${this.nEmits.maxSimul}c/f, ${this.GetEmittingRate()}x`);
				Log(`AimingRate: ${this.aiming.GetRate(true)}`);
				Log(`Impact: ${this.impactPower}`);
				Log(`Total: ${this.totalPower}`);

			});
			//.PushUpdatingFunctions((dt)=>{});

		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.aiming	= Scenes.Aiming
							.Create()
							.PushHitArea( "CRITICAL",	-0.10,	0.10 )
							.PushHitArea( "GOOD",		-0.25,	0.25 )
							.PushHitArea( "NORMAL",		-0.75,	0.75 );

		this.SetLayer(LinkedLayerTags.BG,  this.ccLayers.bg,  0x0000)
			.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット
		this.InitSequence(Sequences.INITIAL,Sequences,this.ccLayerInstances[LinkedLayerTags.MAIN])
			.sequence.Init();

		return this;
	}

	OnUpdating(dt){
		super.OnUpdating(dt);
		this.isOnGround	= ![Sequences.BLOW_AWAY,Sequences.MEASURE ].includes(this.sequence);
		return this;
	}

	UpdateBgLayer(dt){
		const size		= cc.director.getWinSize();
		const bgWidth	= [this.sprites.bg1[0].img.width, this.sprites.bg2[0].img.width, ];

		this.bgScroll	+= this.bgScrollSpeed;
		if     ([Sequences.MEASURE].includes(this.sequence))					this.bgScrollSpeed	= MoveTo(this.bgScrollSpeed,0,0.05);
		else if([Sequences.EMIT,Sequences.BLOW_AWAY].includes(this.sequence))	this.bgScrollSpeed	= MoveTo(this.bgScrollSpeed,8,0.25);
		for(let i=0; i<2; ++i){
			this.sprites.bg1[i]
				.SetPosition(	size.width /2 - Cycle(this.bgScroll, 0, bgWidth[0]) + bgWidth[0]*i,
								null);
		}
		for(let i=0; i<4; ++i){
			this.sprites.bg2[i]
				.SetPosition(	size.width /2 - Cycle(this.bgScroll/2,0,bgWidth[1]) + bgWidth[1]*parseInt(i/2),
								size.height/2 - Cycle(this.bgScroll/4,0,bgWidth[1]) + bgWidth[1]*(i%2),	);
		}
		return this;
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

					_this.sprites.player	= Sprite.CreateInstance(rc.img.player).AddToLayer(this)
												.SetScale(2).Attr({zIndex:5}).SetRotate(-5);
					_this.sprites.meteor	= Sprite.CreateInstance(rc.img.meteor).AddToLayer(this)
												.SetScale(2).Attr({zIndex:2}).SetVisible(true);
					_this.meteorEffect		= Effects.Meteor.Create(8).Init(this);
					_this.playerEffect		= Effects.Fly.Create(32).Init(this);
					_this.explosionEffect	= Effects.Explosion.Create(1).Init(this);

					_this.aiming.Init().SetLayer(this).SetSpritePosition(164,80).SetVisible(false);

					//Labels
					_this.labels.hitArea		= Label.CreateInstance(15).SetColor("#FF7F00").SetPosition(64,150).AddToLayer(this);
					_this.labels.aimingResult	= Label.CreateInstance(15).SetColor("#FFFFFF").SetPosition(64,130).AddToLayer(this);
					_this.labels.distance		= Label.CreateInstance(31).SetColor("#FFFFFF").SetPosition(256,256).AddToLayer(this);
					_this.labels.navigation		= Label.CreateInstance(15).SetColor("FFFFFF").SetIcon(rc.img.navigator).SetPosition(256,32).AddToLayer(this).SetBgEnabled(true);

					_this.SetSequence(Sequences.INITIAL);
					return true;
				},
				update	: function(dt){
					this._super();

					//Player
					_this.UpdatePlayerSprite();

					_this.sprites.meteor.SetPosition(_this.POSITIONS.METEOR.X+Math.min(_this.distanceOfMeteor,250),_this.POSITIONS.METEOR.Y+NormalRandom(4)).Rotate(_this.isOnGround?-7:1);
					_this.meteorEffect.Spawn(_this.sprites.meteor.x,_this.sprites.meteor.y, _this.sequence.count%15==0 && _this.sequence!==Sequences.MEASURE).Update();
					_this.explosionEffect.Update();
					_this.touchedEffect.Update();

					_this.labels.aimingResult.SetString(`${_this.aiming.GetRate(true)}${L.Text("GamePlay.Charge.Unit")}`);
					_this.labels.hitArea.SetString( _this.aiming.GetCurrentArea().text );
					_this.labels.distance.SetString( _this.GetDistanceString() );
					_this.labels.navigation.Update();
					return true;
				},
			})
			.AddToLayerList("bg",{
				ctor:function(){
					this._super();
					this.init();
					this.scheduleUpdate();
					return true;
				},
				init	: function(){
					this._super();
					//_this.SetBackgroundColor(this,"#000000");
					const size	= cc.director.getWinSize();
					_this.sprites.bg2	= CreateArray(4).map(i=> Sprite.CreateInstance(rc.img.bg2).AddToLayer(this).SetVisible(false)	);
					_this.sprites.bg1	= CreateArray(2).map(i=> Sprite.CreateInstance(rc.img.bg1).AddToLayer(this).SetVisible(false)	);
				},
				update	: function(dt){
					this._super();
					_this.UpdateBgLayer(dt);
					_this.sequence.Update(dt,"layer-bg");
				},
			});
		return this;
	}


	/** イベントリスナ初期設定
	 * @returns this
	 */
	InitEventListenerList(){
		super.InitEventListenerList()
			/** インパクトフェイズ */
			.AddPropertiesToEventListenerList("discharge",{
				event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesBegan	: (touch,event)=>{
					if(this.sequence===Sequences.START_AIM){
						this.SetSequence(Sequences.PRELIMINARY);
						return true;
					}
					return false;
				},
				onTouchesEnded	: (touch,event)=>{
					if(this.sequence===Sequences.PRELIMINARY)	this.SetSequence(Sequences.DISCHARGE);
				},
			})
			/** エミットエナジーフェイズ */
			.AddPropertiesToEventListenerList("emitEnergy",{
				event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesBegan	: (touch,event)=>{
					this.nEmits.simul++;
					this.nEmits.total++;
				},
			})
			/** 次フェイズへの単純遷移 */
			.AddPropertiesToEventListenerList("transionToNext",{
				event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesBegan	: (touch,event)=>{
					if(this.isSequenceMovable && this.sequence.NextPhase())	this.SetSequence(this.sequence.NextPhase());
					return true;
				},
			})
			/**リセットボタン*/
			.AddToEventListenerList("resetButton",(sender,type)=>{
				if(type===ccui.Widget.TOUCH_ENDED){
					this.Reset();
				}
			})
			
			.AddPropertiesToEventListenerList("reset",{
				event			: cc.EventListener.KEYBOARD,
				onKeyReleased	: (code,event)=>{
					if(code==82){	//'R'key
						this.Reset();
					}
				},
			});

		//共通イベント対応設定
		let commonEvents	= [];
		commonEvents.push(this.listeners.touched);
		Debug(()=>{
			commonEvents.push(this.listeners.reset);
		});
		Sequence.SetCommonEventListeners(commonEvents);

		//シークエンス-イベント対応設定
		//Sequences.INITIAL.SetEventListeners(		this.listeners.transionToNext	).NextPhase(Sequences.START_AIM);
		Sequences.START_AIM.SetEventListeners(		this.listeners.discharge		);
		Sequences.PRELIMINARY.SetEventListeners(	this.listeners.discharge		);
		Sequences.EMIT.SetEventListeners(			this.listeners.emitEnergy		);

		return this;
	}


	/** エミット倍率を取得
	 * @returns number
	 */
	GetEmittingRate(){
		let power	= 0;
		let add		= EmitEnergy.ADDITIONAL_POWER;
		//エミット値の加算
		for(let i=0; i<this.nEmits.total; ++i){
			power	+= add;
			add		= Math.max(1,--add);
		}
		//マルチタッチ補正
		const rateSimul	= this.nEmits.maxSimul + (this.nEmits.maxSimul-1)/2;

		return power / (rateSimul * EmitEnergy.ADDITIONAL_POWER *50) + 1;
	}

	/** チャージ倍率を取得
	 * @returns {number} 20-80
	 */
	GetChargingRate(){
		return this.chargedPower/BlowPower.INCREMENT + 20;
	}

	/**プレイヤー画像の表示*/
	UpdatePlayerSprite(){
		//座標修正
		let adjY	= this.sprites.player.GetCustomData("adjY",-100);	//修正
		let dy		= this.sprites.player.GetCustomData("dy",  3);		//増分
		if([Sequences.INITIAL,Sequences.START_AIM,Sequences.DISCHARGE_FAILED].includes(this.sequence)){
			dy += adjY < 0	? 0.005	: -0.005;
			if     (dy <-0.25) dy = MoveTo(dy,-0.25,0.05);
			else if(dy > 0.25) dy = MoveTo(dy, 0.25,0.05);
			adjY += dy;
		}

		//スプライト番号
		let idx	= 0;
		if([Sequences.INITIAL,Sequences.START_AIM,Sequences.DISCHARGE_FAILED].includes(this.sequence)){
			idx	= parseInt(this.sequence.count/30) % 2;
		}
		else if([Sequences.PRELIMINARY].includes(this.sequence)){
			idx	= this.chargingCount<BlowPower.MAX/2	? 2	: 5;
		}
		else if([Sequences.DISCHARGE].includes(this.sequence)){
			idx	= this.chargedPower<BlowPower.MAX/2	? 2	: 5;
		}
		else{
			idx	= 3;
			if(this.chargedPower >= BlowPower.MAX/2)	idx	= this.sequence.count<15	? 6 : 7;
		}

		this.sprites.player.SetIndex(idx).SetPosition(this.POSITIONS.PLAYER.X+Math.min(_this.distanceOfMeteor,250)-this.chargingCount/512,this.POSITIONS.PLAYER.Y-this.chargingCount/1024+adjY).SetCustomData("adjY",adjY).SetCustomData("dy",dy);
		this.playerEffect.Spawn(this.sprites.player.x,this.sprites.player.y-32,this.sequence!==Sequences.MEASURE).Update();
		return this;
	}

	GetDistanceString(){
		return L.NumToStr(Math.round( Math.min(this.distanceOfMeteor,this.totalPower)*1000000 )) + L.Text("GamePlay.Distance.Unit");
	}

	/** リセット
	 * @returns this 
	 */
	Reset(){
		Debug(()=>Log("[DEBUG] Reset Scene ----------"));
		this.SetSequence(Sequences.INITIAL);
		return this;
	}

}//class


})();	//File Scope



