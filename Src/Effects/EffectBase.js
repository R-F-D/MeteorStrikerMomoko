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
	}
	static Create(nEntities){return new this(nEntities);}


	Init(layer){return this;}
	Spawn(){return this;}
	Update(){return this;}

} //class


})();	//File Scope
