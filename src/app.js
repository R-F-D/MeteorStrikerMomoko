var cc;

var HelloWorldLayer = cc.Layer.extend({
	sprite:null,
	ctor:function () {
		this._super();

		let sprites	= {};
		sprites.player	= Sprite.CreateInstance(res.img.player);
		console.log(sprites.player);
		sprites.player.Attr(0,{x:100,y:200,}).AddToLayer(0,this);

		return true;
	}
});

var HelloWorldScene	= cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer	= new HelloWorldLayer();
		this.addChild(layer);
	}
});

