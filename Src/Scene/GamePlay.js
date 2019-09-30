/* *******************************************************************************
	GamePlayシーン
********************************************************************************/
var cc,_;
var rc, L,C,sound;
var Sprite,Effect,Store,Label,Achievement,Achievements,Locale,Button;
var NormalRandom,CreateArray,Log,MoveTo,Cycle;
var Scene	= Scene || {};
(function(){	//File Scope

/** 打撃定数 */
const BlowPower	= {
	/**下限値*/			MIN				: -30*256,
	/**上限値*/			MAX				: 60*256,
	/**チャージ上限*/	UPPER_LIMIT		: 2*256,	//MAXに加算
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
/**ナビゲータ情報*/
const NavigatorSettings	= {
	Normal	:{	Key:"Normal",	Storage:Store.Handles.Action.NumNavigates[0],	Achievement:Achievements.Action.Navigate00,	},
	Golem	:{	Key:"Golem",	Storage:Store.Handles.Action.NumNavigates[1],	Achievement:Achievements.Action.Navigate01,	},
	Goddess	:{	Key:"Goddess",	Storage:Store.Handles.Action.NumNavigates[2],	Achievement:Achievements.Action.Navigate02,	},
};

Scene.GamePlay	= class extends Scene.SceneBase {


	constructor(){
		super();

		/** @var 座標 */
		this.POSITIONS	= {
			PLAYER	: {	X:96,	Y:96,	},
			METEOR	: {	X:192,	Y:144,	},
		};

		/** シークエンス列挙型 */
		this.Sequences	= {
			/**初期状態*/		INITIAL			: null,
			/**エイム作動*/		START_AIM		: null,
			/**打撃予備動作*/	PRELIMINARY		: null,
			/**打撃動作*/		DISCHARGE		: null,
			/**エミット中*/		EMIT			: null,
			/**吹き飛ばし*/		BLOW_AWAY		: null,
			/**プレイヤー退場*/	LEAVE			: null,
			/**ダイアログ表示*/	DIALOG			: null,
			/**動作失敗*/		DISCHARGE_FAILED: null,
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

		this.EnableNaviButtons(0);
		this.buttons	= {};

		/** シェアを行ったかどうか */
		this.isShared	= false;

		/** ccSceneのインスタンス */
		this.ApplicateCcSceneInstance(this).InitLayerList();

		/** ラベル */
		this.labels	= {
			hitArea:null, distance:null,	navigation:null,
		}

		//ナビゲーター
		this.navigator	= this.GetNavigatorSetting();

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
					this.init();
					this.scheduleUpdate();
					return true;
				},
				init	: function(){
					this._super();
					_this.sprites			= _this.sprites||{};
					_this.sprites.player	= Sprite.CreateInstance(rc.img.player).AddToLayer(this).Attr({zIndex:5});
					_this.sprites.meteor	= Sprite.CreateInstance(rc.img.meteor).AddToLayer(this).Attr({zIndex:2});
					_this.sprites.distance	= Sprite.CreateInstance(rc.img.distance).AddToLayer(this).Attr({zIndex:3});
					_this.sprites.hitArea	= Sprite.CreateInstance(rc.img.hitArea).AddToLayer(this).Attr({zIndex:110});
					_this.sprites.txtLaunch	= [	Sprite.CreateInstance(rc.img.txtLaunch).AddToLayer(this).Attr({zIndex:111}),
												Sprite.CreateInstance(rc.img.txtLaunch).AddToLayer(this).Attr({zIndex:111}),	];
					_this.sprites.bgLaunch	= Sprite.CreateInstance(rc.img.bgLaunch).AddToLayer(this).Attr({zIndex:110});

					_this.fx			= _this.fx||{};
					_this.fx.meteor		= Effect.Meteor.Create(8).Init(this);
					_this.fx.player		= Effect.Fly.Create(32).Init(this);
					_this.fx.explosion	= Effect.Explosion.Create(1).Init(this);
					_this.fx.preliminary= Effect.Preliminary.Create().Init(this);
					_this.fx.hit		= Effect.Hit.Create().Init(this);
					_this.fx.emit		= Effect.Emit.Create().Init(this);

					_this.aiming.Init().SetLayer(this);

					//Labels
					_this.labels.distance		= Label.CreateInstance(12,rc.font.distance).AddToLayer(this);
					_this.labels.navigation		= Label.CreateInstance(15,rc.font.talk).SetIcon(rc.img.navigator).AddToLayer(this);
					_this.labels.navigation.iconOpacity	= 192;

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
					_this.sprites		= _this.sprites||{};
					_this.sprites.bgSpace	= CreateArray(4).map(()=> Sprite.CreateInstance(rc.img.bgSpace).AddToLayer(this).SetVisible(false)	);
					_this.sprites.bgGround	= CreateArray(2).map(()=> Sprite.CreateInstance(rc.img.bgGround).AddToLayer(this).SetVisible(false)	);
				},
				update	: function(dt){
					this._super();
					if(_this.pauseCount > 0){
						--_this.pauseCount;
						return;
					}
					_this.UpdateBgLayer(dt);
					_this.sequence.Update(dt,"layer-bg");
				},
			})

			return this;
	}

	OnUiLayerCreate(layer){
		this.buttons	= Button.CreateInstance(3).AddToLayer(layer);
		this.buttons.at(0).CreateSprite(rc.img.titleButton).SetTag("Back");
		this.buttons.at(1).CreateSprite(rc.img.titleButton).SetTag("Retry");
		this.buttons.at(2).CreateSprite(rc.img.titleButton).SetTag("Share");
		return true;
	}

	/** シーケンス毎の処理を定義
	 * @returns this
	 */
	SetSequenceFunctions(){

		const size	= cc.director.getWinSize();

		//初期状態
		this.Sequences.INITIAL.PushStartingFunctions(()=>{

			this.bgScroll			= 0;
			this.bgScrollSpeed		= -8;
			this.chargingCount		= BlowPower.INITIAL;
			this.chargedPower		= 0;
			this.dischargeSpeed		= 0;
			this.distanceOfMeteor	= 0;
			this.isShared			= false;

			this.aiming.SetSpritePosition(164,80).SetVisible(false);
			this.pageNavigator.buttons.at("Reset").SetVisible(true);

			//スプライト
			this.sprites.player
				.SetPosition(-128,0).SetScale(2)
				.SetCustomData("isFlying",true).SetCustomData("adjY").SetCustomData("dy")
				.RunActions(cc.delayTime(3.0), cc.moveTo(3.0,cc.p(this.POSITIONS.PLAYER.X,this.POSITIONS.PLAYER.Y)).easing(cc.easeBackOut(5)));

			this.sprites.meteor
				.SetPosition(this.POSITIONS.METEOR.X+1417,this.POSITIONS.METEOR.Y+256)
				.SetScale(2).SetVisible(true)
				.RunActions(cc.delayTime(3.0), cc.moveTo(3.0,cc.p(this.POSITIONS.METEOR.X,this.POSITIONS.METEOR.Y)));

			this.sprites.distance.SetScale(1).SetVisible(false);
			this.sprites.hitArea.SetVisible(false).SetPosition(48,140).SetScale(0);
			this.sprites.bgGround.forEach(s=>s.SetPosition(0,512/2).SetOpacity(255).SetVisible(true));
			this.sprites.bgSpace.forEach(s=>s.SetPosition(0,size.height/2).SetOpacity(255).SetVisible(false));

			//開始時テキスト
			this.sprites.bgLaunch
				.SetPosition(-1020+size.width/2,-89+size.height/2+32).SetRotate(-5).SetScale(4.4).SetOpacity(255).SetVisible(true)
				.RunActions(
					cc.delayTime(0.5),
					[	cc.scaleTo(0.5,2.2),	cc.fadeTo(0.5,255),	cc.moveTo(0.5,cc.p(size.width/2,size.height/2+32)),	],
					cc.delayTime(2.0),
					[	cc.scaleTo(0.5,1.1),	cc.fadeTo(0.5,0),	cc.moveTo(0.5,cc.p(510+size.width/2,45+size.height/2+32)),	],
					cc.callFunc(()=>this.sprites.bgLaunch.SetVisible(false))
				);
			this.sprites.txtLaunch.forEach((sprite,i)=>{
				sprite
					.SetIndex(i).SetScale(2).SetVisible(true).SetOpacity(0)
					.SetPosition(-510+size.width/2+i*32,-45+size.height/2+18-i*36+40).SetRotate(-5)
					.RunActions(
						cc.delayTime(1.0+0.3*i),
						[
							cc.fadeTo(0.5,255),
							cc.scaleTo(0.5,1.5),
							cc.moveTo(0.5,cc.p(size.width/2-16+i*32,size.height/2-1+18-i*36+40)),
						],
						cc.moveTo(1.0,cc.p(size.width/2+16+i*32,size.height/2+1+18-i*36+40)),
						[
							cc.fadeTo(0.5,0),
							cc.scaleTo(0.5,0.50),
							cc.moveTo(0.5,cc.p(512+size.width/2+i*32,45+size.height/2+18-i*36+40)),
						],
						cc.callFunc(()=>this.sprites.txtLaunch[i].SetVisible(false))
					);
			})

			//エフェクト
			this.fx.player.SetVelocity(0,0,0.0,0);
			this.fx.meteor.SetVelocity(0,3);
			this.fx.meteor.SetColor();
			this.fx.preliminary.Destroy();

			//ラベル
			this.labels.distance.SetVisible(false).SetFontColor("#00FF00").SetNumLogLines(1);
			this.labels.navigation.Init().SetVisible(false).SetPosition(256,32).SetBgEnabled(true).SetIconPosition(-4,4).SetNumLogLines(2);

			this.InitUIs();
			sound.PlayMusic(rc.bgm.meteorite);
		})
		.PushUpdatingFunctions((/*dt*/)=>{
			this.UpdatePlayerSprite(false);
			this.UpdateMeteorSprite(false);
			this.aiming.Update(false);
			if(!this.sprites.player.IsRunningActions() && !this.sprites.meteor.IsRunningActions())	this.SetSequence(this.Sequences.START_AIM);
		});

		//エイム作動
		this.Sequences.START_AIM
			.PushStartingFunctions(()=>{
				this.sprites.player.SetCustomData("isFlying",false)
				this.labels.navigation.PushLog(L.Text("GamePlay.Navigator.Aim"),null).SetVisible(true);
				this.aiming.SetVisible(true,true);
				this.fx.player.SetVelocity(-1,-0.5,0.5,0);
				this.fx.meteor.SetVelocity(8,3);
			})
			.PushUpdatingFunctions((/*dt*/)=>{
				this.UpdatePlayerSprite(true);
				this.UpdateMeteorSprite(true);
				this.aiming.Update();
			});

		//打撃予備動作
		this.Sequences.PRELIMINARY
			.PushStartingFunctions(()=>{
				this.fx.preliminary.Spawn(64,48);
				this.labels.navigation.PushLog(L.Text("GamePlay.Navigator.Preliminary")).SetVisible(true);
			})
			.PushUpdatingFunctions((/*dt*/)=>{
				this.UpdatePlayerSprite(true);
				this.UpdateMeteorSprite(true);
				this.aiming.Update();
				this.fx.preliminary.Update();
				this.chargingCount += BlowPower.INCREMENT;
				if(this.chargingCount > BlowPower.MAX+BlowPower.UPPER_LIMIT)	this.SetSequence(this.Sequences.DISCHARGE_FAILED);
			});

		//打撃動作
		this.Sequences.DISCHARGE
			.PushStartingFunctions(()=>{
				this.chargedPower	= Math.min(this.chargingCount,BlowPower.MAX);
				this.dischargeSpeed	= BlowPower.DISCHARGE_SPEED;
				this.fx.preliminary.Destroy();

				//連続成功実績
				const nSuccessiveHits	= Store.DynamicInsert(Store.Handles.GamePlay.NumSuccessiveHits);
				const maxSuccessiveHits	= Store.Insert(Store.Handles.GamePlay.MaxSuccessiveHits, nSuccessiveHits);
				Achievement.Unlock(Achievements.Blowing.SuccessiveHits, maxSuccessiveHits);
			})
			.PushUpdatingFunctions((/*dt*/)=>{
				this.UpdatePlayerSprite(true);
				this.UpdateMeteorSprite(true);
				this.aiming.Update();
				this.dischargeSpeed *= BlowPower.ACCELERATION;
				this.chargingCount -= this.dischargeSpeed;
				if(this.chargingCount < BlowPower.MIN){
					this.SetSequence(this.Sequences.EMIT);
				}
			});

		//打撃動作失敗
		this.Sequences.DISCHARGE_FAILED
			.PushStartingFunctions(()=>{
				this.fx.preliminary.Destroy();
				Store.Insert(Store.Handles.GamePlay.NumSuccessiveHits,0,null);	//連続成功数の初期化
			})
			.PushUpdatingFunctions((/*dt*/)=>{
				this.UpdatePlayerSprite(true);
				this.UpdateMeteorSprite(true);
				this.aiming.Update();
				this.chargingCount-=BlowPower.DECREMENT;
				if(this.chargingCount < 0)	this.SetSequence(this.Sequences.START_AIM);
			});

		//エミット中
		this.Sequences.EMIT
			.PushStartingFunctions(()=>{
				this.nEmits.simul		= 0;
				this.nEmits.maxSimul	= 1;
				this.acceptEmitting		= EmitEnergy.ACCEPTION_COUNT;
				this.nEmits.total		= 0;

				//実績
				const currentArea	= this.aiming.GetCurrentArea();
				const rate			= this.aiming.GetRate(true);
				const bestRate		= Store.Insert(Store.Handles.GamePlay.BestAiming, rate);
				Achievement.Unlock(Achievements.Aiming.TruePerfect,bestRate);
				if(rate>=100.0)	Store.DynamicInsert( Store.Handles.GamePlay.NumTruePerfects );

				if(["PERFECT","GOOD"].includes(currentArea.tag)){
					const nPerfects	= currentArea.tag=="PERFECT"	? Store.DynamicInsert(Store.Handles.GamePlay.NumPerfects)
																	: Number( Store.Select( Store.Handles.GamePlay.NumPerfects, 0) );
					const nGoods	= currentArea.tag=="GOOD"		? Store.DynamicInsert(Store.Handles.GamePlay.NumGoods)
																	: Number( Store.Select( Store.Handles.GamePlay.NumGoods, 0) );
					Achievement.Unlock(Achievements.Aiming.ManyPerfect,nPerfects);
					Achievement.Unlock(Achievements.Aiming.ManyGood,nPerfects+nGoods);
				}

				const currentBlowRate	= this.GetChargingRate()/20*100;	//100-400%
				Store.Insert(Store.Handles.GamePlay.BestBlowing, currentBlowRate);
				if(currentBlowRate>=400)	Store.DynamicInsert(Store.Handles.GamePlay.NumFullPowerBlowings);
				if(this.playerHardblows()){
					const nHardBlowings	= Store.DynamicInsert( Store.Handles.GamePlay.NumHardBlowings );
					Achievement.Unlock(Achievements.Blowing.ManyHard, nHardBlowings);
					if(currentArea.tag=="PERFECT"){
						const nHardAndPerfectBlowings	= Store.DynamicInsert( Store.Handles.GamePlay.NumHardAndPerfectBlowings );
						Achievement.Unlock(Achievements.Blowing.HardAndPerfect, nHardAndPerfectBlowings);
					}
				}

				//平均倍率
				Store.Log(Store.Handles.GamePlay.MeanBlowing, currentBlowRate);
				Store.Log(Store.Handles.GamePlay.MeanAiming, rate);

				//エイミング精度の表示
				this.sprites.hitArea
					.SetIndex(currentArea.imgIndex)
					.SetVisible(true)
					.RunActions( cc.scaleTo(0.25,1).easing(cc.easeBackOut(10)) );
				this.aiming.SpawnRateValue(28,118);

				//Labels
				this.labels.navigation.PushLog(L.Text("GamePlay.Navigator.Emit")).SetVisible(true);

				//Fx
				this.fx.hit.Spawn(this.sprites.player.x+32,this.sprites.player.y, this.playerHardblows()?2.0:1.0 );
				this.fx.player.SetVelocity(+1,+0.5,-2,-1);
				this.fx.meteor.SetVelocity(-8,-4).SetColor("#FFFF00");

				sound.PlayMusic(rc.bgm.strike);
			})
			.PushUpdatingFunctions((/*dt*/)=>{
				if(this.sequence.count==0)	this.pauseCount = this.playerHardblows ? 10 : 5;

				this.UpdatePlayerSprite(true);
				this.UpdateMeteorSprite(true);
				this.aiming.Update(false);

				this.acceptEmitting--;
				if(this.acceptEmitting < 0)	this.SetSequence(this.Sequences.BLOW_AWAY);

				//マルチタッチ検出
				this.nEmits.maxSimul	= Math.max(this.nEmits.simul,this.nEmits.maxSimul);
				this.nEmits.simul		= 0;
			});

		//吹き飛ばし
		this.Sequences.BLOW_AWAY
			.PushStartingFunctions(()=>{
				this.impactPower		= this.GetChargingRate() * this.aiming.GetTotalRate();
				this.totalPower			= this.GetEmittingRate() * this.impactPower + 10;
				this.distanceOfMeteor	= 0;

				this.sprites.bgSpace.forEach(s=>s.SetVisible(true));
				this.aiming.SetVisible(false);
				this.sprites.distance.SetVisible(true);
				this.sprites.hitArea.SetVisible(false);
				this.aiming.HideRateValue();
				this.labels.distance.SetVisible(true);
				this.labels.navigation.SetVisible(false);

				//エミット実績
				const emitRate		= Math.trunc(this.GetEmittingRate() *100);
				const maxEmitRate	= Store.Insert(Store.Handles.GamePlay.MaxEmittings, emitRate );
				Achievement.Unlock(Achievements.Emit.Many01, maxEmitRate);
				Achievement.Unlock(Achievements.Emit.Many02, maxEmitRate);
				Achievement.Unlock(Achievements.Emit.Many03, maxEmitRate);
				Achievement.Unlock(Achievements.Emit.Many04, maxEmitRate);

				Store.Log(Store.Handles.GamePlay.MeanEmitting, emitRate);
			})
			.PushUpdatingFunctions((/*dt*/)=>{
				this.UpdatePlayerSprite(true);
				this.UpdateMeteorSprite(true);
				this.aiming.Update(false);

				const oldDistance	= this.GetDistanceInKm();
				this.distanceOfMeteor+= 0.2+NormalRandom(0.05);
				const newDistance	= this.GetDistanceInKm();

				//前フレームの距離と現フレームの距離を見て、超えた瞬間にセリフを出す
				const passingPoint	= C.Check.find(c=> oldDistance<=c.distance && c.distance<=newDistance);
				if(passingPoint){
					this.labels.navigation
						.PushLog(L.Text(`GamePlay.Navigator.BrowAway.${passingPoint.key}`))
						.SetVisible(true);
					Achievement.Unlock(Achievements.Check[passingPoint.key],1);
					if(passingPoint.storage!==null && Store.Handles.GamePlay.NumPassings[passingPoint.storage])	Store.DynamicInsert(Store.Handles.GamePlay.NumPassings[passingPoint.storage]);
				}

				if(this.totalPower <= this.distanceOfMeteor)	this.SetSequence(this.Sequences.LEAVE);
			})
			.PushUpdatingFunctions("layer-bg", (/*dt*/)=>{
				this.sprites.bgGround.forEach(sprite=>{
					sprite
						.SetRelativePosition(null,-4)
						.SetOpacity(Math.max(0,255-this.sequence.count*4));
				})
			});

		//プレイヤー退場
		this.Sequences.LEAVE
			.PushStartingFunctions(()=>{

				this.sprites.bgGround.forEach(s=>s.SetVisible(false));
				this.sprites.meteor.SetVisible(false);
				this.sprites.distance.SetVisible(false);
				this.sprites.player.RunActions(
					cc.delayTime(1),
					cc.callFunc(()=>{
						this.sprites.player
							.SetCustomData("isFlying",true)
							.entity.setFlippedX(true);
					}),
					[
						cc.moveTo(3.0,cc.p(-32,size.height-32)).easing(cc.easeBackIn(10)),
						cc.scaleTo(3.0,0.5).easing(cc.easeBackIn(10))
					]
				);
				this.fx.explosion.Spawn(this.sprites.meteor.x,this.sprites.meteor.y);
				this.fx.player.SetVelocity(0,0,0,0);
				this.pageNavigator.buttons.at("Reset").SetVisible(false);

				//スコアとハイスコア
				const score 	= this.GetDistanceInKm();
				const highScore	= Store.Insert(Store.Handles.GamePlay.HighScore,score );
				Store.Log(Store.Handles.GamePlay.MeanDistance, score);

				this.labels.distance.SetVisible(false);
				this.labels.navigation.PushLog( L.Textf("GamePlay.Navigator.Leave", [L.NumToStr(score)+L.Text("Unit.Distance")] ),null).SetVisible(true);

				//ハイスコア基準のチェックポイント実績
				C.Check
					.filter( c=> c.distance<=highScore )
					.forEach(c=> Achievement.Unlock(Achievements.Check[c.key],1) );

				sound.StopMusic();

				Log(`Emit: ${this.nEmits.total}c, ${this.nEmits.maxSimul}c/f, ${this.GetEmittingRate()}x`);
				Log(`AimingRate: ${this.aiming.GetRate(true)}`);
				Log(`Impact: ${this.impactPower}`);
				Log(`Total: ${this.totalPower}`);
			})
			.PushUpdatingFunctions((/*dt*/)=>{
				this.UpdatePlayerSprite(false);
				this.UpdateMeteorSprite(false);
				if(!this.sprites.player.IsRunningActions())	this.SetSequence(this.Sequences.DIALOG);
			});

		//ダイアログ表示
		this.Sequences.DIALOG
			.PushStartingFunctions(()=>{
				this.sprites.player.SetVisible(false);
				this.buttons.SetVisible(true);

				//初プレイ実績
				const nPlays	= Store.DynamicInsert(Store.Handles.Action.NumPlays);
				Achievement.Unlock(Achievements.Action.FirstPlay,nPlays);
				//ナビ実績
				const nNavigates	= Store.DynamicInsert(this.navigator.Storage);
				Achievement.Unlock(this.navigator.Achievement,nNavigates);
			})
			.PushUpdatingFunctions((/*dt*/)=>{
				this.UpdatePlayerSprite(false);
			});

		return this;
	}

	OnEnter(){
		super.OnEnter();
		this.aiming	= Scene.Aiming.Create();

		this.SetLayer(LinkedLayerTags.BG,  this.ccLayers.bg,  0x0000)
			.SetLayer(LinkedLayerTags.MAIN,this.ccLayers.main,0x0001);	//各種処理があるのでmainレイヤは最後にセット

		this.InitSequences(this.Sequences,LinkedLayerTags.MAIN,this.ccLayerInstances[LinkedLayerTags.MAIN])
			.SetSequence(this.Sequences.INITIAL);

		return this;
	}

	OnUpdating(dt){
		super.OnUpdating(dt);

		this.buttons.Update();
		this.fx.explosion.Update();
		this.fx.hit.Update();
		this.fx.emit.Update();

		//ナビゲータのアイコン画像
		const naviIcon	= (()=>{
			const indexes	= {
				Normal:		[4,1,2,7, 4,1,2,7, 4,1,2,7, 4,5,6,7,],
				Golem:		[8,9,10,10,8,14,15,15, 8,9,10,10,8,14,15,15, 8,9,10,11,12,13,15,15,],
				Goddess:	[20,17,18,23, 20,17,18,23, 20,17,18,23, 20,21,22,23,],
			}[this.navigator.Key];
			return indexes[ Math.trunc(this.sequence.count/8) % indexes.length ];
		})();
		this.labels.navigation.SetIconIndex(naviIcon).Update();

		this.isOnGround	= ![this.Sequences.BLOW_AWAY,this.Sequences.LEAVE,this.Sequences.DIALOG].includes(this.sequence);
		return this;
	}

	UpdateBgLayer(/*dt*/){
		const size		= cc.director.getWinSize();
		const bgWidth	= [this.sprites.bgGround[0].img.width, this.sprites.bgSpace[0].img.width, ];

		if(![this.Sequences.INITIAL].includes(this.sequence))	this.bgScroll	+= this.bgScrollSpeed;
		if     ([this.Sequences.LEAVE,this.Sequences.DIALOG].includes(this.sequence))	this.bgScrollSpeed	= MoveTo(this.bgScrollSpeed,0,0.05);
		else if([this.Sequences.EMIT,this.Sequences.BLOW_AWAY].includes(this.sequence))	this.bgScrollSpeed	= MoveTo(this.bgScrollSpeed,8,0.25);

		this.sprites.bgGround.forEach((sprite,i)=>{
			sprite
				.SetPosition(	size.width /2 - Cycle(this.bgScroll, 0, bgWidth[0]) + bgWidth[0]*i,
								null);
		});
		this.sprites.bgSpace.forEach((sprite,i)=>{
			sprite
				.SetPosition(	size.width /2 - Cycle(this.bgScroll/2,0,bgWidth[1]) + bgWidth[1]*Math.trunc(i/2),
								size.height/2 - Cycle(this.bgScroll/4,0,bgWidth[1]) + bgWidth[1]*(i%2),	);
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
				onTouchesBegan	: (/*touch,event*/)=>{
					if(this.sequence===this.Sequences.START_AIM){
						this.SetSequence(this.Sequences.PRELIMINARY);
						return true;
					}
					return false;
				},
				onTouchesEnded	: (/*touch,event*/)=>{
					if(this.sequence===this.Sequences.PRELIMINARY)	this.SetSequence(this.Sequences.DISCHARGE);
				},
			})
			/** エミットエナジーフェイズ */
			.AddPropertiesToEventListenerList("emitEnergy",{
				event			: cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesBegan	: (/*touch,event*/)=>{
					this.nEmits.simul++;
					this.nEmits.total++;
					this.fx.emit.Spawn(this.sprites.player.x,this.sprites.player.y);
				},
			});

		//共通イベント対応設定
		let commonEvents	= [];
		commonEvents.push(this.listeners.touched);
		commonEvents.push(this.listeners.keyboardReset);
		this.SetCommonEventListeners("SceneBase.TouchFx",commonEvents);

		//シークエンス-イベント対応設定
		this.Sequences.START_AIM.SetEventListeners(  LinkedLayerTags.MAIN, this.listeners.discharge		);
		this.Sequences.PRELIMINARY.SetEventListeners(LinkedLayerTags.MAIN, this.listeners.discharge		);
		this.Sequences.EMIT.SetEventListeners(       LinkedLayerTags.MAIN, this.listeners.emitEnergy	);

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

	/** ナビゲーター設定を取得 */
	GetNavigatorSetting(){
		const naviKey	= Store.Select(Store.Handles.Settings.Navigator);
		return _(NavigatorSettings).find(ns=>naviKey==ns.Key) || NavigatorSettings.Normal;
	}

	/**プレイヤー画像の表示*/
	UpdatePlayerSprite(changesPosition=true){
		//座標修正
		if(changesPosition){
			let adjY	= this.sprites.player.GetCustomData("adjY",0);	//修正
			let dy		= this.sprites.player.GetCustomData("dy",  -0.25);		//増分
			if([this.Sequences.START_AIM,this.Sequences.DISCHARGE_FAILED].includes(this.sequence)){
				dy += adjY < 0	? 0.005	: -0.005;
				adjY += dy;
			}
			this.sprites.player
				.SetPosition(this.POSITIONS.PLAYER.X+Math.min(this.distanceOfMeteor,250)-this.chargingCount/512,this.POSITIONS.PLAYER.Y-this.chargingCount/1024+adjY)
				.SetCustomData("adjY",adjY).SetCustomData("dy",dy);
		}

		//スプライト番号
		let idx	= this.sequence.count%128<16 ? 2 : 0;
		if([this.Sequences.PRELIMINARY].includes(this.sequence)){	//振りかぶり
			idx	= this.playerHardblows(this.chargingCount)	? 10	: 0;
		}
		else if([this.Sequences.DISCHARGE_FAILED].includes(this.sequence)){	//攻撃失敗
			idx	= 2;
		}
		else if([this.Sequences.DISCHARGE].includes(this.sequence)){	//攻撃中
			idx	= this.playerHardblows()	? 10	: 8;
		}
		else if([this.Sequences.EMIT,this.Sequences.BLOW_AWAY].includes(this.sequence)){ //攻撃ヒット後
			idx	= this.playerHardblows()	? 12	: 8;
		}
		if(this.sprites.player.GetCustomData("isFlying",false) && idx<4)	idx	+= 4;	//飛行状態
		if(Math.trunc(this.count/8) % 2) ++idx;
		this.sprites.player.SetIndex(idx);

		//角度
		this.sprites.player.SetRotate( this.sprites.player.GetCustomData("isFlying",false) ? 0:-5 );

		//Other
		let fxAdj	= 4<=idx && idx<8 	? {x:-16,y:-8,}	:  {x:0,y:-32,};
		if(this.sprites.player.entity.isFlippedX())	fxAdj.x*=-1;
		this.fx.player.Spawn(this.sprites.player.entity.x+fxAdj.x,this.sprites.player.entity.y+fxAdj.y,this.sprites.player.visible).Update();
		return this;
	}

	/** 隕石画像の更新 */
	UpdateMeteorSprite(changesPosition=true){
		const m	={
			x:this.POSITIONS.METEOR.X+Math.min(this.distanceOfMeteor,250),
			y:this.POSITIONS.METEOR.Y,
		};

		if(changesPosition)	this.sprites.meteor.SetPosition(m.x,m.y+NormalRandom(4));
		this.sprites.meteor.Rotate(this.isOnGround?-7:1);
		this.sprites.distance.SetPosition(m.x+64+16+8,m.y-24);
		this.fx.meteor.Spawn(this.sprites.meteor.entity.x,this.sprites.meteor.entity.y,this.sequence.count%15==0 && this.sprites.meteor.visible).Update();
		if(this.labels.distance.IsVisible()){
			this.labels.distance.SetPosition(m.x+96+8,m.y-48+6).SetString(L.Textf("GamePlay.Distance",[L.NumToStr(this.GetDistanceInKm(),0,"en"),L.Text("Unit.Distance",Locale.UniversalCode)]));
		}
		return this;
	}

	GetDistanceInKm(){
		return Math.round( Math.min(this.distanceOfMeteor,this.totalPower)*1000000 );
	}

	/** プレイヤーが強打モーションを行うか
	 * @param {number?} [power=this.chargedPowerl]	検証するパワー値。省略時
	 * @returns {boolean}
	 */
	playerHardblows(power=this.chargedPower){
		return !(power < BlowPower.MAX/2);
	}

	/** UIパーツ初期化 */
	InitUIs(){
		super.InitUIs();
		const size	= cc.director.getWinSize();

		this.pageNavigator.buttons.at("Reset").OnMouseHover(
			()=>this.labels.navigation.SetTempText(L.Text("GamePlay.Navigator.Result.Reset")),
			()=>this.labels.navigation.RemoveTempText()
		);

		this.buttons.at("Back")
			.SetVisible(true)
			.SetPosition(size.width/2-128,size.height/2)
			.SetIndex(6+1).SetIndex(Button.OFF,6)
			.AssignKeyboard(cc.KEY["1"])
			.OnMouseHover(
				()=>this.labels.navigation.SetTempText(L.Text("GamePlay.Navigator.Result.Reset")),
				()=>this.labels.navigation.RemoveTempText()
			)
			.OnButtonUp(()=>{
				this.ResetForce();
			});

		this.buttons.at("Retry")
			.SetVisible(true)
			.SetPosition(size.width/2,size.height/2)
			.SetIndex(2+1).SetIndex(Button.OFF,2)
			.AssignKeyboard(cc.KEY["2"])
			.OnMouseHover(
				()=>this.labels.navigation.SetTempText(L.Text("GamePlay.Navigator.Result.Retry")),
				()=>this.labels.navigation.RemoveTempText()
			)
			.OnButtonUp(()=>{
				this.ReplaceScene(Scene.GamePlay);
			});

		this.buttons.at("Share")
			.SetVisible(true)
			.SetPosition(size.width/2+128,size.height/2)
			.SetIndex(4+1).SetIndex(Button.OFF,4)
			.AssignKeyboard(cc.KEY["3"])
			.SetAutoOff(true)
			.OnMouseHover(
				()=>this.labels.navigation.SetTempText(L.Text("GamePlay.Navigator.Result.Share")),
				()=>this.labels.navigation.RemoveTempText()
			)
			.OnButtonUp(()=>{
				if(!this.isShared){
					this.isShared	= true;
					const nShares	= Store.DynamicInsert(Store.Handles.Action.NumShares);
					Achievement.Unlock(Achievements.Action.Share, nShares);
				}
				this.labels.navigation.RemoveTempText();
				cc.sys.openURL( L.Textf("About.Share.Format",[
									L.Textf("About.Share.Text",	[ L.NumToStr(this.GetDistanceInKm()),	L.Text("Unit.Distance"), ]),
									C.WebPage,
									L.Text("About.HashTags")
								]));
			});

		this.buttons.SetVisible(false);

		return this;
	}

}//class


})();	//File Scope
