/********************************************************************************
	実績
********************************************************************************/
const Achievements = (()=>{let Achievements={};	//Achievements scoop

//エイミング精度
Achievements.Aiming	= {
	ManyPerfect:		{Key:"Aiming.ManyPerfect",	IsPublic:true,	Count:3,	Replacements:[],	},	//パーフェクト
	ManyGood:			{Key:"Aiming.ManyGood",		IsPublic:true,	Count:4,	Replacements:[],	},	//グッド以上
	TruePerfect:		{Key:"Aiming.TruePerfect",	IsPublic:true,	Count:100,	Replacements:null,	},	//100%パーフェクト
};

//打撃力
Achievements.Blowing	= {
	ManyHard:			{Key:"Blowing.ManyHard",			IsPublic:true,	Count:5,	Replacements:[],	},	//強打
	HardAndPerfect:		{Key:"Blowing.HardAndPerfect",		IsPublic:true,	Count:1,	Replacements:null,	},	//強打でパーフェクト
	SuccessiveHits:		{Key:"Blowing.SuccessiveHits",		IsPublic:true,	Count:5,	Replacements:[],	},	//連続ヒット
};

//エミット
Achievements.Emit	= {
	Many01:			{Key:"Emit.Many01",		IsPublic:true,	Count:150,	Replacements:[L.Text("GamePlay.Emitting.Unit")],	},	// 約28回
	Many02:			{Key:"Emit.Many02",		IsPublic:true,	Count:160,	Replacements:[L.Text("GamePlay.Emitting.Unit")],	},	// 約35回
	Many03:			{Key:"Emit.Many03",		IsPublic:true,	Count:170,	Replacements:[L.Text("GamePlay.Emitting.Unit")],	},	// 約42回
	Many04:			{Key:"Emit.Many04",		IsPublic:true,	Count:180,	Replacements:[L.Text("GamePlay.Emitting.Unit")],	},	// 約50回
};

//チェックポイント到達
Achievements.CheckPoint	= {
	Venus:			{Key:"Check.Venus",		IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Venus,  L.Text("GamePlay.Distance.Unit")],	},	//金星
	Mars:			{Key:"Check.Mars",		IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Mars,   L.Text("GamePlay.Distance.Unit")],	},	//火星
	Mercury:		{Key:"Check.Mercury",	IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Mercury,L.Text("GamePlay.Distance.Unit")],	},	//水星
	Sun:			{Key:"Check.Sun",		IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Sun,    L.Text("GamePlay.Distance.Unit")],	},	//太陽
	Kirari:			{Key:"Check.Kirari",	IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Kirari, L.Text("GamePlay.Distance.Unit")],	},	//諸星きらり
	Unicorn:		{Key:"Check.Unicorn",	IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Unicorn,L.Text("GamePlay.Distance.Unit")],	},	//ピンクのユニコーン
};

//ユーザアクション
Achievements.Action	= {
	Complete: 		{Key:"Action.Complete",		IsPublic:true,	Count:1,	Replacements:null,	},	//コンプリート
	FirstPlay:		{Key:"Action.FirstPlay",	IsPublic:true,	Count:1,	Replacements:null,	},	//初プレイ
	Share:			{Key:"Action.Share",		IsPublic:true,	Count:1,	Replacements:null,	},	//シェア
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

		this.label.forcedPushesToLog	= false;
		this.label.nPushedLinesAtOnce	= 2;

		return;
	}

	Update(dt){
		if(this.label)	this.label.Update(dt);
	}

	/** 実績解除
	 * @param {Achievemtns} achievement 実績オブジェクト
	 * @param {number} count カウンタ
	 */
	Unlock(achievement,count){
		if(achievement==null) return this;

		Store.Insert(
			`${this.PrefixStorageKey}${achievement.Key}`,
			Scene.SceneBase.GetDate().getTime(),
			(oldValue,newValue)	=> oldValue===null && achievement.Count<=count,	//cond
			(key,value)			=> {
				const title	= Array.isArray(achievement.Replacements)	? L.Textf(key+".Title",[achievement.Count].concat(achievement.Replacements))
																		: L.Text (key+".Title");
				this.label.PushLog(`${L.Text("Achievement.Unlocked")}\n${title}`);
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



