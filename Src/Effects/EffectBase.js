/* *******************************************************************************
	エフェクト基本クラス
********************************************************************************/
var Effects	= Effects || {};
var cc;
(function(){	//File Scope

Effects.EffectBase	= class{

	constructor(nEntities=5){
		this.nEntities	= nEntities;
		this.entities	= []
		this.initialVelocity	= {x:0,y:0};
		this.acceleration		= {x:0,y:0};
	}
	static Create(nEntities){return new this(nEntities);}

	SetVelocity(initDx,initDy,accelDx=0,accelDy=0){
		this.initialVelocity.x	= initDx;
		this.initialVelocity.y	= initDy;
		this.acceleration.x		= accelDx;
		this.acceleration.y		= accelDy;
		return this;
	}

	Init(layer){return this;}
	Spawn(){return this;}
	Update(){return this;}

} //class


})();	//File Scope
