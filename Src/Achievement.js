/********************************************************************************
	実績
********************************************************************************/
const Achievements = (()=>{let Achievements={};	//Achievements scoop

//エイミング精度
Achievements.Aiming	= {
	ManyPercefts	: {Key:"Aiming.ManyPerfects",	IsSecret:false,	Count:5,	Replacements:[null,null],	},
	ManyGoods		: {Key:"Aiming.ManyGoods",		IsSecret:false,	Count:10,	Replacements:[null,null],	},
	TruePerfect		: {Key:"Aiming.TruePerfect",	IsSecret:false,	Count:100,	Replacements:[null,null],	},
};

//チェックポイント到達
Achievements.CheckPoint	= {
	Venus		: {Key:"Check.Venus",		IsSecret:false,	Count:1,	Replacements:[null,[C.CheckPoints.Venus,  L.Text("GamePlay.Distance.Unit")]],	},
	Mars		: {Key:"Check.Mars",		IsSecret:false,	Count:1,	Replacements:[null,[C.CheckPoints.Mars,   L.Text("GamePlay.Distance.Unit")]],	},
	Mercury		: {Key:"Check.Mercury",		IsSecret:false,	Count:1,	Replacements:[null,[C.CheckPoints.Mercury,L.Text("GamePlay.Distance.Unit")]],	},
	Sun			: {Key:"Check.Sun",			IsSecret:false,	Count:1,	Replacements:[null,[C.CheckPoints.Sun,    L.Text("GamePlay.Distance.Unit")]],	},
	Kirari		: {Key:"Check.Kirari",		IsSecret:false,	Count:1,	Replacements:[null,[C.CheckPoints.Kirari, L.Text("GamePlay.Distance.Unit")]],	},
	Unicorn		: {Key:"Check.Unicorn",		IsSecret:false,	Count:1,	Replacements:[null,[C.CheckPoints.Unicorn,L.Text("GamePlay.Distance.Unit")]],	},
};

//ユーザアクション
Achievements.Action	= {
	Complete	: {Key:"Action.Complete",	IsSecret:false,	Count:1,	Replacements:[null,null],	},
	Share		: {Key:"Action.Share",		IsSecret:false,	Count:1,	Replacements:[null,null],	},
};

//実績総数
let nAchievements = 0;
_.forEach(Achievements,category=>{nAchievements+=_.size(category)});
Achievements.Action.Complete.Count = nAchievements-1;


return Achievements})(); //Achievement Scoop
//--------------------------------------------------------------------------------


/** 実績
 * @class Achievement
 */
const Achievement = new (class Achievement{
	constructor(){
		this.PrefixStorageKey	= "Achievement.";
		this.NumItems	= Achievements.Action.Complete.Count+1;

		this.layer	= null;
		this.label	= null;
	}

	Init(){
		this.label	= Label.CreateInstance(9)
						.AddToLayer(this.layer)
						.SetBgEnabled(true)
						.SetPosition(512-128,288-16)
						.SetNumLogLines(2);

		return;
	}

	Update(dt){
		if(this.label)	this.label.Update(dt);
	}

	Set(achievement,count){
		if(achievement==null) return this;

		InsertToStorage(
			`${this.PrefixStorageKey}${achievement.Key}`,
			Scene.SceneBase.GetDate().getTime(),
			(oldValue,newValue)=> oldValue===null && achievement.Count<=count,	//cond
			(k,v)=>{	// is OK
				this.label.PushLog(`Unlocked: ${L.Text(k+".Title")}`);
			}
		);
		return this;
	}

	SetLayer(layer){
		this.layer = layer;
		if(this.label)	this.label.AddToLayer(layer);
		return this;
	}

	get nItems(){
		return Achievements.Action.Complete.Count+1;
	}
	get nUnlockedItems(){
		let n	= 0;
		_.forEach(Achievements,category=>{
			_.forEach(category,a=>{
				const date = cc.sys.localStorage.getItem(key);
				if(date!==null && 0<date) ++n;
			});
		});
		return n;
	}

})();



