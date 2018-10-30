var cc;
var Scenes	= Scenes || {};
(function(){	//File Scope

//Scenes.GamePlay	= Scenes.GamePlay	|| {};
let _this	= null;

Scenes.GamePlay	= class{

	constructor(){
		_this					= this;
		this.ccSceneInstance	= null;
		/** Player */
		this.player	= {pos:{x:0,y:0,},};

		/** ccSceneのインスタンス */
		this.ccSceneInstance	= new (cc.Scene.extend({
			/** 生成 */
			onEnter:function (){
				this._super();

				var layer	= new _this.ccLayers.Main();
				layer.init();
				this.addChild(layer);

				this.scheduleUpdate();
			},

			/** 更新 */
			update:function(dt){
				const canvasSize	= cc.director.getWinSize();
				_this.player.pos.x++;
				_this.player.pos.y++;
				if(_this.player.pos.x > canvasSize.width )	_this.player.pos.x = 0;
				if(_this.player.pos.y > canvasSize.height)	_this.player.pos.y = 0;
			},
		}))();

		/** ccLayerに渡す用 */
		this.ccLayers	= {
			Main	: cc.Layer.extend({

				sprites	: {},

				/**	生成 */
				ctor:function(){
					this._super();
					this.sprites.player	= Sprite.CreateInstance(res.img.player).AddToLayer(0,this);
					return true;
				},
				init	: function(){
					this._super();
					this.scheduleUpdate();
					return true;
				},
				update	: function(dt){
					this._super();
					this.sprites.player.Attr(0,_this.player.pos);
					return true;
				},
			}),
		}

	}

	/** Create Instance */
	static Create(){return new Scenes.GamePlay();}
	/** Get cc.Scene Instance */
	GetCcSceneInstance(){return this.ccSceneInstance;}

}//class
})();	//File Scope


