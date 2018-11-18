/* *******************************************************************************
	GamePlayシーン
********************************************************************************/
var Scenes	= Scenes || {};
var cc;
(function(){	//File Scope

/** classへのthis */
let _this	= null;
/** シークエンス列挙型 */
const Sequences	= {
	/**初期状態*/		INITIAL			: Sequence.Create(),
	/**エイム作動*/		START_AIM		: Sequence.Create(),
	/**打撃予備動作*/	PRELIMINARY		: Sequence.Create(),
	/**打撃動作*/		DISCHARGE		: Sequence.Create(),
	/**打撃ヒット後*/	IMPACTED		: Sequence.Create(),
	/**エミット中*/		EMIT			: Sequence.Create(),
	/**吹き飛ばし*/		BLOW_AWAY		: Sequence.Create(),
	/**測定中*/			MEASURE			: Sequence.Create(),
	/**動作失敗*/		DISCHARGE_FAILED: Sequence.Create(),
};
/** 打撃定数 */
const BlowPower	= {
	/**上限値*/			MIN				: 0,
	/**上限値*/			MAX				: 60*256,
	/**初期値*/			INITIAL			: 0,
	/**増分*/			INCREMENT		: 1*256,
	/**失敗時の減少*/	DECREMENT		: 1*256,
	/**主動作の速度*/	DISCHARGE_SPEED	: 4*256,
	/**主動作の加速度*/	ACCELERATION	: 1.20,
};
/** エミットエナジー定数*/
const EmitEnergy	= {
	/**エミット受付期間*/	ACCEPTION_COUNT:	300,
};
/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: 0,
};

Scenes.GamePlay	= class extends Scenes.SceneBase {

	constructor(){
		super();
		_this					= this;

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
		/** @var エミット値 */
		this.emittingPower		= 0;

		//結果表示用
		/** @var インパクト時の威力*/
		this.impactPower		= 0;
		/** @var 最終的に与えられた威力 */
		this.totalPower			= 0;
		/** @var 隕石の移動距離 */
		this.meteorX			= 0;

		/** ccSceneのインスタンス */
		this.ccSceneInstance	= new (cc.Scene.extend({
			/** 生成 */
			onEnter	: function (){
				this._super();
				_this.aiming	= Scenes.Aiming.Create();
				_this.SetLayer(LinkedLayerTags.MAIN,_this.ccLayers.impact);
				_this.InitSequence(Sequences.INITIAL,Sequences,_this.ccLayerInstances[LinkedLayerTags.MAIN]);
				_this.sequence.Init();

				this.scheduleUpdate();
			},
			/** 更新 */
			update	: function(dt){
				_this.OnUpdating(dt);
				_this.sequence.Update(dt);
				_this.OnUpdated(dt);
			},
		}))();

		/** ccLayerに渡す用 */
		this.ccLayers	= {
			/** インパクトシークエンスのメインレイヤ */
			impact	: cc.Layer.extend({
				/**	生成 */
				ctor:function(){
					this._super();
					this.init();
					this.scheduleUpdate();
					return true;
				},
				/** 初期化 */
				init	: function(){
					this._super();

					_this.chargingCount		= BlowPower.INITIAL;
					_this.chargedPower		= 0;
					_this.dischargeSpeed	= 0;
					_this.SetSequence(Sequences.INITIAL);
					_this.sprites.player	= Sprite.CreateInstance(res.img.player).AddToLayer(this).SetPosition(100,100);
					_this.aiming.Init().SetLayer(this).SetSpritePosition(140,100);

					_this.labels.chargedPower	= Label.CreateInstance().setColor("#FFFFFF").setPosition(300,100).AddToLayer(this);
					_this.labels.aiming			= Label.CreateInstance().setColor("#FFFFFF").setPosition(300,80).AddToLayer(this);
					_this.labels.emittingPower	= Label.CreateInstance().setColor("#FFFFFF").setPosition(300,60).AddToLayer(this);

					return true;
				},
				/** 更新 */
				update	: function(dt){
					this._super();
					if(IsAnyOf(_this.sequence,[Sequences.INITIAL,Sequences.START_AIM,Sequences.PRELIMINARY,Sequences.DISCHARGE_FAILED])){
						_this.sprites.player.setIndex(0);
					}
					else{
						_this.sprites.player.setIndex(1);
					}
					_this.sprites.player.SetPosition(100-_this.chargingCount/512,100);

					_this.labels.chargedPower.setString(	"Charged: "	+ _this.chargedPower	);
					_this.labels.aiming.setString(			"Aiming: "	+ _this.aiming.position	);
					_this.labels.emittingPower.setString(	"Emitting: "+ _this.emittingPower	);
					return true;
				},
			}),
		};

		/** ラベル */
		this.labels	= {
			chargedPower	: null,
			aiming			: null,
			emittingPower	: null,
		}

		//シークエンス設定
		this.SetSequenceFunctions().InitEventListeners();
	}


	/** シーケンス毎の処理を定義
	 * @returns this
	 */
	SetSequenceFunctions(){
		//初期状態
	//	Sequences.INITIAL.PushStartingFunctions(()=>{}).PushUpdatingFunctions((dt)=>{});

		//エイム作動
		Sequences.START_AIM
		//	.PushStartingFunctions(()=>{})
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
					this.SetSequence(Sequences.IMPACTED);
				}
			});

		//打撃動作失敗
		Sequences.DISCHARGE_FAILED
		//	.PushStartingFunctions(()=>{})
			.PushUpdatingFunctions((dt)=>{
				this.aiming.Update();
				this.chargingCount-=BlowPower.DECREMENT;
				if(this.chargingCount < BlowPower.MIN)	this.SetSequence(Sequences.START_AIM);
			});

		//打撃ヒット
		Sequences.IMPACTED
		//	.PushStartingFunctions(()=>{})
			.PushUpdatingFunctions((dt)=>{
				this.SetSequence(Sequences.EMIT);
				this.acceptEmitting	= EmitEnergy.ACCEPTION_COUNT;
				this.emittingPower		= 0;
			});

		//エミット中
		Sequences.EMIT
		//	.PushStartingFunctions(()=>{})
			.PushUpdatingFunctions((dt)=>{
				this.acceptEmitting--;
					if(this.acceptEmitting < 0){
					this.SetSequence(Sequences.BLOW_AWAY);

					this.impactPower	= this.aiming.GetTotalRate() * (this.chargedPower/256 + 30);
					this.totalPower	= this.aiming.GetTotalRate() * (this.chargedPower/256 + 30 + this.emittingPower*2);

					debug("Emit: "		+ this.emittingPower	);
					debug("AimingRate: "+ this.aiming.GetRate());
					debug("Impact: "	+ this.impactPower		);
					debug("Total: "		+ this.totalPower		);
				}
			});

		//吹き飛ばし
	//	Sequences.BLOW_AWAY.PushStartingFunctions(()=>{}).PushUpdatingFunctions((dt)=>{});

		//計測中
	//	Sequences.MEASURE.PushStartingFunctions(()=>{}).PushUpdatingFunctions((dt)=>{});

		return this;
	}


	/** イベントリスナ初期設定
	 * @returns this
	 */
	InitEventListeners(){

		/**イベントリスナ*/
		this.listeners	= {
			/** インパクトフェイズ */
			discharge	: cc.EventListener.create({
				event		: cc.EventListener.MOUSE,
				onMouseUp	: (event)=>{
					this.SetSequence(Sequences.DISCHARGE);
				},
			}),
			/** エミットエナジーフェイズ */
			emitEnergy	: cc.EventListener.create({
				event		: cc.EventListener.MOUSE,
				onMouseDown: (event)=>{
					this.emittingPower++;
				},
			}),
			/** リセット */
			reset		:cc.EventListener.create({
				event		: cc.EventListener.KEYBOARD,
				onKeyReleased: (code,event)=>{
					if(code==82){	//'R'key
						debug("[DEBUG] Reset Scene ----------");
						this.SetSequence(Sequences.INITIAL);
					}
				},
			}),
			/** 次フェイズへの単純遷移 */
			transionToNext	:cc.EventListener.create({
				event		: cc.EventListener.TOUCH_ONE_BY_ONE,
				onTouchBegan: (touch,event)=>{
					if(this.sequence.NextPhase())	this.SetSequence(this.sequence.NextPhase());
				},
			}),
		};

		//シークエンス-イベント対応設定
		Sequence.SetCommonEventListeners(this.listeners.reset);
		Sequences.INITIAL.SetEventListeners(		this.listeners.transionToNext	).NextPhase(Sequences.START_AIM);
		Sequences.START_AIM.SetEventListeners(		this.listeners.transionToNext	).NextPhase(Sequences.PRELIMINARY);
		Sequences.PRELIMINARY.SetEventListeners(	this.listeners.discharge		);
		Sequences.EMIT.SetEventListeners(			this.listeners.emitEnergy		);

		return this;
	}

}//class


})();	//File Scope



