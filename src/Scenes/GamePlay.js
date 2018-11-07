/* *******************************************************************************
	GamePlayシーン
********************************************************************************/
var Scenes	= Scenes || {};
var cc;
(function(){	//File Scope

/** classへのthis */
let _this	= null;
/** シークエンス列挙型 */
const Sequence	= {
	/**初期状態*/		INITIAL			: 0,
	/**エイム作動*/		START_AIM		: 1,
	/**打撃予備動作*/	PRELIMINARY		: 2,
	/**打撃動作*/		ACTION			: 3,
	/**打撃ヒット後*/	IMPACTED		: 4,
	/**エミット中*/		EMIT			: 5,
	/**吹き飛ばし*/		BLOW_AWAY		: 6,
	/**測定中*/			MEASURE			: 7,
	/**動作失敗*/		ACTION_FAILED	: -1,
};
/** エイミングゲージ定数 */
const AimingGauge	= {
	/**下限値*/		MIN			: -32767,
	/**ジャスト*/	JUST		: 0,
	/**上限値*/		MAX			: 32768,
	/**初期値*/		INITIAL		: 32768,
	/**増分*/		INCREMENT	: -1024,
};
/** 打撃定数 */
const BlowPower	= {
	/**上限値*/			MIN			: 0,
	/**上限値*/			MAX			: 60*256,
	/**初期値*/			INITIAL		: 0,
	/**増分*/			INCREMENT	: 1*256,
	/**失敗時の減少*/	DECREMENT	: 1*256,
	/**主動作の速度*/	ACTION_SPEED: 4*256,
	/**主動作の加速度*/	ACCELERATION: 1.20,
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
		this.seq				= Sequence.INITIAL;

		//インパクトシークエンス
		this.chargingCount		= BlowPower.INITIAL;
		this.chargedPower		= 0;
		this.actionSpeed		= 0;
		this.aiming				= AimingGauge.INITIAL;
		//エミットエナジーシークエンス
		this.acceptEmitting		= 0;
		this.emittingPower		= 0;
		//結果表示用
		this.impactPower		= 0;
		this.totalPower			= 0;
		this.meteorX			= 0;


		/** ccSceneのインスタンス */
		this.ccSceneInstance	= new (cc.Scene.extend({
			/** 生成 */
			onEnter:function (){
				this._super();
				_this.SetLayer(LinkedLayerTags.MAIN,_this.ccLayers.impact);

				this.scheduleUpdate();
			},
			/** 更新 */
			update:function(dt){

				//エイミングカーソル作動
				if(IsAnyOf( _this.seq, [Sequence.START_AIM,Sequence.PRELIMINARY,Sequence.ACTION,Sequence.ACTION_FAILED] )){
					_this.aiming+=AimingGauge.INCREMENT;
					if     (_this.aiming < AimingGauge.MIN)	_this.aiming = AimingGauge.MAX;
					else if(_this.aiming > AimingGauge.MAX)	_this.aiming = AimingGauge.MIN;
				}

				switch(_this.seq){
					case Sequence.PRELIMINARY:
						_this.chargingCount+=BlowPower.INCREMENT;
						if(_this.chargingCount > BlowPower.MAX)	_this.seq		= Sequence.ACTION_FAILED;
						break;
					case Sequence.ACTION:
						_this.actionSpeed *= BlowPower.ACCELERATION;
						_this.chargingCount -= _this.actionSpeed;
						if(_this.chargingCount < BlowPower.MIN)	_this.seq	= Sequence.IMPACTED;
						break;
					case Sequence.ACTION_FAILED:
						_this.chargingCount-=BlowPower.DECREMENT;
						if(_this.chargingCount < BlowPower.MIN)	_this.seq		= Sequence.START_AIM;
						break;
					case Sequence.IMPACTED:
						_this.seq				= Sequence.EMIT;
						_this.acceptEmitting	= EmitEnergy.ACCEPTION_COUNT;
						_this.emittingPower		= 0;
						_this.SetLayer(LinkedLayerTags.MAIN,_this.ccLayers.emitEnergy);
						break;
					case Sequence.EMIT:
						_this.acceptEmitting--;
						if(_this.acceptEmitting < 0){
							_this.seq	= Sequence.BLOW_AWAY;
							console.log(_this.emittingPower);

							_this.impactPower	= (65536 - Math.abs(_this.aiming))/256 * (65536 - Math.abs(_this.aiming))/256 * (_this.chargedPower/256 + 30);
							_this.totalPower	= (65536 - Math.abs(_this.aiming))/256 * (65536 - Math.abs(_this.aiming))/256 * (_this.chargedPower/256 + 30 + _this.emittingPower*2);
							console.log("AimingRate: "+(65536 - Math.abs(_this.aiming))*(65536 - Math.abs(_this.aiming))/(256*128*256*128*2));
							console.log("Impact: "+_this.impactPower);
							console.log("Total: "+_this.totalPower);
						}
						break;
					case Sequence.BLOW_AWAY:
						break;
					case Sequence.MEASURE:
						break;
					default:
				}

				const canvasSize	= cc.director.getWinSize();
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
					_this.actionSpeed		= 0;
					_this.seq				= Sequence.INITIAL;
					_this.aiming			= AimingGauge.INITIAL;

					_this.sprites.aimGauge		= Sprite.CreateInstance(res.img.aimGauge).AddToLayer(this).Attr({x:120,y:100});
					_this.sprites.aimCursor		= Sprite.CreateInstance(res.img.aimCursor).AddToLayer(this).Attr( {x:120,y:100,});
					_this.sprites.player		= Sprite.CreateInstance(res.img.player).AddToLayer(this);

					_this.labels.chargedPower	= Label.CreateInstance().setColor("#FFFFFF").setPosition(300,100).AddToLayer(this);
					_this.labels.seq			= Label.CreateInstance().setColor("#FFFFFF").setPosition(300,80).AddToLayer(this);
					_this.labels.aiming			= Label.CreateInstance().setColor("#FFFFFF").setPosition(300,60).AddToLayer(this);
					_this.labels.emittingPower	= Label.CreateInstance().setColor("#FFFFFF").setPosition(300,40).AddToLayer(this);

					cc.eventManager.addListener(_this.listeners.impact,this);
					cc.eventManager.addListener(_this.listeners.reset,this);

					return true;
				},
				/** 更新 */
				update	: function(dt){
					this._super();
					switch(_this.seq){
						case Sequence.ACTION:
						case Sequence.IMPACTED:
							_this.sprites.player.setIndex(1);
							break;
						default:
							_this.sprites.player.setIndex(0);
					}
					_this.sprites.player.Attr({x:100-_this.chargingCount/1024,y:100,});
					_this.sprites.aimCursor.Attr({x:120,y:100+_this.aiming/512,});

					_this.labels.chargedPower.setString("Charged: " + _this.chargedPower);
					_this.labels.seq.setString("Sequence: " + _this.seq);
					_this.labels.aiming.setString("Aiming: " + _this.aiming);
					return true;
				},
			}),
			/** エミットエナジーシークエンスのメインレイヤ */
			emitEnergy	: cc.Layer.extend({
				ctor:function(){
					this._super();
					this.init();
					this.scheduleUpdate();
					return true;
				},
				init	: function(){
					this._super();
					_this.sprites.aimGauge.AddToLayer(this).Attr({x:120,y:100});
					_this.sprites.aimCursor.AddToLayer(this).Attr( {x:120,y:100+_this.aiming/512,});
					_this.sprites.player.AddToLayer(this);

					_this.labels.chargedPower.AddToLayer(this);
					_this.labels.seq.AddToLayer(this);
					_this.labels.aiming.AddToLayer(this);
					_this.labels.emittingPower.AddToLayer(this);

					cc.eventManager.addListener(_this.listeners.emitEnergy,this);
					cc.eventManager.addListener(_this.listeners.reset,this);
				},
				update	: function(){
					_this.labels.chargedPower.setString("Charged: " + _this.chargedPower);
					_this.labels.seq.setString("Sequence: " + _this.seq);
					_this.labels.aiming.setString("Aiming: " + _this.aiming);
					_this.labels.emittingPower.setString("Emitting: " + _this.emittingPower);
					this._super();
				},
			}),
		};

		/** ラベル */
		this.labels	= {
			chargedPower	: null,
			seq				: null,
			aiming			: null,
			emittingPower	: null,
		}

		/** イベントリスナ */
		this.listeners	= {
			/** インパクトフェイズ */
			impact	: cc.EventListener.create({
				event		: cc.EventListener.TOUCH_ONE_BY_ONE,
				onTouchBegan: function(touch,event){
					switch(_this.seq){
						case Sequence.INITIAL:		_this.seq	= Sequence.START_AIM;		break;
						case Sequence.START_AIM:	_this.seq	= Sequence.PRELIMINARY;	break;
						default:
					}
					return true;
				},
				onTouchEnded	: function(touch,event)	{
					switch(_this.seq){
						case Sequence.PRELIMINARY:
							_this.seq			= Sequence.ACTION;
							_this.chargedPower	= _this.chargingCount;
							_this.actionSpeed	= BlowPower.ACTION_SPEED;
							break;
						default:
					}
				},
				onTouchCanceled	: function(touch,event)	{
					switch(_this.seq){
						case Sequence.PRELIMINARY:	_this.seq	= Sequence.ACTION_FAILED;	break;
						default:
					}
				},
			}),
			/** エミットエナジーフェイズ */
			emitEnergy	: cc.EventListener.create({
				event		: cc.EventListener.MOUSE,
				onMouseDown: function(touch,event){
					switch(_this.seq){
						case Sequence.EMIT:
							_this.emittingPower++;
							break;
						default:
					}
					return true;
				},
			}),
			/** リセット */
			reset		:cc.EventListener.create({
				event		: cc.EventListener.KEYBOARD,
				onKeyReleased: function(code,event){
					if(code==82){
						_this.seq		= Sequence.INITIAL;
						_this.SetLayer(LinkedLayerTags.MAIN,_this.ccLayers.impact);
					}
				},
			}),
		};

	}

}//class
})();	//File Scope



