/* *******************************************************************************
	GamePlayシーン
********************************************************************************/
var Scenes	= Scenes || {};
var cc;
(function(){	//File Scope

/** classへのthis */
let _this	= null;
/** インパクトシークエンス列挙型 */
const ImpactSequence	= {
	/**初期状態*/	INITIAL		: 0,
	/**エイム作動*/	START_AIM	: 1,
	/**予備動作*/	PRELIMINARY	: 2,
	/**主動作*/		ACTION		: 3,
	/**ヒット後*/	IMPACTED	: 4,
	/**動作失敗*/	FAILED		: -1,
};
/** エイミングゲージ定数 */
const AimingGauge	= {
	/**下限値*/		MIN			: -32767,
	/**ジャスト*/	JUST		: 0,
	/**上限値*/		MAX			: 32768,
	/**初期値*/		INITIAL		: 32768,
	/**増分*/		INCREMENT	: -1024,
};
/** 定数 */
const BlowPower	= {
	/**上限値*/			MIN			: 0,
	/**上限値*/			MAX			: 60*256,
	/**初期値*/			INITIAL		: 0,
	/**増分*/			INCREMENT	: 1*256,
	/**失敗時の減少*/	DECREMENT	: 1*256,
	/**主動作の速度*/	MOTION_SPEED: 4*256,
	/**主動作の加速度*/	ACCELERATION: 1.20,
};
/** リンクされたレイヤーのタグ */
const LinkedLayerTags	= {
	MAIN	: 0,
};

Scenes.GamePlay	= class{

	constructor(){
		_this					= this;
		this.ccSceneInstance	= null;
		this.ccLayerInstances	= [];
		/** Player */
		this.chargingCount		= BlowPower.INITIAL;
		this.chargedPower		= 0;
		this.motionSpeed		= 0;
		/** インパクトシークエンス */
		this.impactSeq			= ImpactSequence.INITIAL;
		this.aiming				= AimingGauge.INITIAL;


		/** ccSceneのインスタンス */
		this.ccSceneInstance	= new (cc.Scene.extend({
			/** 生成 */
			onEnter:function (){
				this._super();
				_this.SetLayer(LinkedLayerTags.MAIN,_this.ccLayers.main);

				this.scheduleUpdate();
			},
			/** 更新 */
			update:function(dt){

				switch(_this.impactSeq){
					case ImpactSequence.PRELIMINARY:
						_this.chargingCount+=BlowPower.INCREMENT;
						if(_this.chargingCount > BlowPower.MAX)	_this.impactSeq		= ImpactSequence.FAILED;
						break;
					case ImpactSequence.ACTION:
						_this.motionSpeed *= BlowPower.ACCELERATION;
						_this.chargingCount -= _this.motionSpeed;
						if(_this.chargingCount < BlowPower.MIN)	_this.impactSeq		= ImpactSequence.IMPACTED;
						break;
					case ImpactSequence.FAILED:
						_this.chargingCount-=BlowPower.DECREMENT;
						if(_this.chargingCount < BlowPower.MIN)	_this.impactSeq		= ImpactSequence.START_AIM;
						break;
					default:
				}

				if(_this.impactSeq!==ImpactSequence.INITIAL && _this.impactSeq!==ImpactSequence.IMPACTED){
					_this.aiming+=AimingGauge.INCREMENT;
					if     (_this.aiming < AimingGauge.MIN)	_this.aiming = AimingGauge.MAX;
					else if(_this.aiming > AimingGauge.MAX)	_this.aiming = AimingGauge.MIN;
				}

				const canvasSize	= cc.director.getWinSize();
			},
		}))();

		this.sprites	= {};
		/** ccLayerに渡す用 */
		this.ccLayers	= {
			main	: cc.Layer.extend({
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
					_this.motionSpeed		= 0;
					_this.impactSeq			= ImpactSequence.INITIAL;
					_this.aiming			= AimingGauge.INITIAL;

					_this.sprites.aimGauge		= Sprite.CreateInstance(res.img.aimGauge).AddToLayer(this);
					_this.sprites.aimCursor		= Sprite.CreateInstance(res.img.aimCursor).AddToLayer(this);
					_this.sprites.player			= Sprite.CreateInstance(res.img.player).AddToLayer(this);

					_this.labels.chargedPower	= Label.CreateInstance().setColor("#FFFFFF").setPosition(300,100).AddToLayer(this);
					_this.labels.impactSeq		= Label.CreateInstance().setColor("#FFFFFF").setPosition(300,80).AddToLayer(this);
					_this.labels.aiming			= Label.CreateInstance().setColor("#FFFFFF").setPosition(300,60).AddToLayer(this);

					cc.eventManager.addListener(_this.listeners.impact,this);
					cc.eventManager.addListener(_this.listeners.reset,this);

					return true;
				},
				/** 更新 */
				update	: function(dt){
					this._super();
					switch(_this.impactSeq){
						case ImpactSequence.ACTION:
						case ImpactSequence.IMPACTED:
							_this.sprites.player.setIndex(1);
							break;
						default:
							_this.sprites.player.setIndex(0);
					}
					_this.sprites.player.Attr({x:100-_this.chargingCount/1024,y:100,});
					_this.sprites.aimGauge.Attr( {x:120,y:100,});
					_this.sprites.aimCursor.Attr({x:120,y:100+_this.aiming/512,});

					_this.labels.chargedPower.setString("Score: " + _this.chargingCount + " -> " + _this.chargedPower);
					_this.labels.impactSeq.setString("Sequence: " + _this.impactSeq);
					_this.labels.aiming.setString("Aiming: " + _this.aiming);
					return true;
				},
			}),

			main2	: cc.Layer.extend({
				ctor:function(){
					this._super();
					return true;
				},
			}),
		};

		/** ラベル */
		this.labels	= {
			chargedPower	: null,
			impactSeq		: null,
			aiming			: null,
		}

		/** イベントリスナ */
		this.listeners	= {
			/** インパクトフェイズ */
			impact	: cc.EventListener.create({
				event		: cc.EventListener.TOUCH_ONE_BY_ONE,
				onTouchBegan: function(touch,event){
					switch(_this.impactSeq){
						case ImpactSequence.INITIAL:	_this.impactSeq	= ImpactSequence.START_AIM;		break;
						case ImpactSequence.START_AIM:	_this.impactSeq	= ImpactSequence.PRELIMINARY;	break;
						default:
					}
					return true;
				},
				onTouchEnded	: function(touch,event)	{
					switch(_this.impactSeq){
						case ImpactSequence.PRELIMINARY:
							_this.impactSeq		= ImpactSequence.ACTION;
							_this.chargedPower	= _this.chargingCount;
							_this.motionSpeed	= BlowPower.MOTION_SPEED;
							break;
						default:
					}
				},
				onTouchCanceled	: function(touch,event)	{
					switch(_this.impactSeq){
						case ImpactSequence.PRELIMINARY:	_this.impactSeq	= ImpactSequence.FAILED;	break;
						default:
					}
				},
			}),
			/** エミットエナジーフェイズ */
			emitEnergy	: cc.EventListener.create({
				event		: cc.EventListener.MOUSE,
				onMouseDown: function(touch,event){
					_this.chargedPower++;
					return true;
				},
			}),
			/** リセット */
			reset		:cc.EventListener.create({
				event		: cc.EventListener.KEYBOARD,
				onKeyReleased: function(code,event){
					if(code==82){
						_this.impactSeq		= ImpactSequence.INITIAL;
						_this.SetLayer(0,_this.ccLayers.main);
					}
				},
			}),
		};

	}

	/** Create Instance */
	static Create(){return new Scenes.GamePlay();}
	/** Get cc.Scene Instance */
	GetCcSceneInstance(){return this.ccSceneInstance;}

	/** レイヤ内容の変更
	 * @param {*} layerTag,
	 * @param {*} nextLayerInstance
	 * @param {Number} zOrder Zオーダー
	 */
	SetLayer(layerTag,nextLayer,zOrder=0){
		if(!nextLayer)	return null;

		if(this.ccLayerInstances[layerTag]){
			this.ccLayerInstances[layerTag].unscheduleUpdate();
			_this.ccSceneInstance.removeChildByTag(layerTag);
		}
		this.ccLayerInstances[layerTag]	= new nextLayer();
		_this.ccSceneInstance.addChild(_this.ccLayerInstances[layerTag],zOrder,layerTag);

		return this.ccLayerInstances[layerTag];
	}

}//class
})();	//File Scope


