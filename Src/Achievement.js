/********************************************************************************
	実績
********************************************************************************/
const Achievements = (()=>{		//Achievements scoop
	let Achievements={};

	//エイミング精度
	Achievements.Aiming	= {
		ManyPerfect		:{	IsPublic:true,	Count:3,	Replacements:[],	},	//パーフェクト
		ManyGood		:{	IsPublic:true,	Count:4,	Replacements:[],	},	//グッド以上
		TruePerfect		:{	IsPublic:true,	Count:100,	Replacements:null,	},	//100%パーフェクト
	};
	//打撃力
	Achievements.Blowing	= {
		ManyHard		:{	IsPublic:true,	Count:5,	Replacements:[],	},	//強打
		HardAndPerfect	:{	IsPublic:true,	Count:1,	Replacements:null,	},	//強打でパーフェクト
		SuccessiveHits	:{	IsPublic:true,	Count:5,	Replacements:[],	},	//連続ヒット
	};
	//エミット
	Achievements.Emit	= {
		Many01			:{	IsPublic:true,	Count:150,	Replacements:[L.Text("Unit.Emit")],	},	// 約28回
		Many02			:{	IsPublic:true,	Count:160,	Replacements:[L.Text("Unit.Emit")],	},	// 約35回
		Many03			:{	IsPublic:true,	Count:170,	Replacements:[L.Text("Unit.Emit")],	},	// 約42回
		Many04			:{	IsPublic:true,	Count:180,	Replacements:[L.Text("Unit.Emit")],	},	// 約50回
	};
	//チェックポイント到達
	Achievements.Check	= {
		Venus			:{	IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Venus,  L.Text("Unit.Distance")],	},	//金星
		Mars			:{	IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Mars,   L.Text("Unit.Distance")],	},	//火星
		Mercury			:{	IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Mercury,L.Text("Unit.Distance")],	},	//水星
		Sun				:{	IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Sun,    L.Text("Unit.Distance")],	},	//太陽
		Kirari			:{	IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Kirari, L.Text("Unit.Distance")],	},	//諸星きらり
		Unicorn			:{	IsPublic:true,	Count:1,	Replacements:[C.CheckPoints.Unicorn,L.Text("Unit.Distance")],	},	//ピンクのユニコーン
	};
	//ユーザアクション
	Achievements.Action	= {
		Complete		:{	IsPublic:true,	Count:1,	Replacements:null,	},	//コンプリート
		FirstPlay		:{	IsPublic:true,	Count:1,	Replacements:null,	},	//初プレイ
		Share			:{	IsPublic:true,	Count:1,	Replacements:null,	},	//シェア
	};


	//Keyプロパティの生成
	let nAchievements = 0;	//実績総数
	_(Achievements).forEach(
		(handles,category) =>	{
			nAchievements+=_.size(handles);
			_(handles).forEach(	(h,key) =>	h.Key = `${category}.${key}`);
		}
	);
	Achievements.Action.Complete.Count = nAchievements-1;	//コンプリート実績

	return Achievements;
})(); //Achievement Scoop
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
		const size		= cc.director.getWinSize();

		this.label	= Label.CreateInstance(9)
						.AddToLayer(this.layer)
						.SetBgEnabled(true)
						.SetAnchorPoint(1.0,1.0)
						.SetPosition(size.width-4,size.height-6)
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
			{Key:`${this.PrefixStorageKey}${achievement.Key}`},
			Scene.SceneBase.GetDate().getTime(),
			(oldValue,newValue)	=> oldValue===null && achievement.Count<=count,	//cond
			(key,value)			=> {
				const title	= Array.isArray(achievement.Replacements)	? L.Textf(key,[achievement.Count].concat(achievement.Replacements))
																		: L.Text (key);
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



