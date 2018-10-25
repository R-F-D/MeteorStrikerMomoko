var cc;

var HelloWorldLayer = cc.Layer.extend({
	sprite:null,
	ctor:function () {
		this._super();
		var size	= cc.winSize;

		// create and initialize a label
		var helloLabel	= new cc.LabelTTF("Hello World", "Arial", 38);
		helloLabel.x	= size.width / 2;
		helloLabel.y	= size.height / 2 + 200;
		this.addChild(helloLabel, 5);

		// add "HelloWorld" splash screen"
		this.sprite = new cc.Sprite(res.HelloWorld_png);
		this.sprite.attr({
			x: size.width / 2,
			y: size.height/ 2
		});
		this.addChild(this.sprite, 0);

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

