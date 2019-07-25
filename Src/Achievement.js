/********************************************************************************
	実績
********************************************************************************/
const Achievements = (()=>{		//Achievements scoop
	let Achievements={};

	//エイミング精度
	Achievements.Aiming	= {
		ManyPerfect		:{	IsPublic:true,	Count:3,	Order:0x1000,	Replacements:[],	},	//パーフェクト
		ManyGood		:{	IsPublic:true,	Count:4,	Order:0x1001,	Replacements:[],	},	//グッド以上
		TruePerfect		:{	IsPublic:true,	Count:100,	Order:0x1002,	Replacements:null,	},	//100%パーフェクト
	};
	//打撃力
	Achievements.Blowing	= {
		ManyHard		:{	IsPublic:true,	Count:5,	Order:0x1100,	Replacements:[],	},	//強打
		HardAndPerfect	:{	IsPublic:true,	Count:1,	Order:0x1101,	Replacements:null,	},	//強打でパーフェクト
		SuccessiveHits	:{	IsPublic:true,	Count:5,	Order:0x1102,	Replacements:[],	},	//連続ヒット
	};
	//エミット
	Achievements.Emit	= {
		Many01			:{	IsPublic:true,	Count:150,	Order:0x2200,	Replacements:[L.Text("Unit.Emit")],	},	// 約28回
		Many02			:{	IsPublic:true,	Count:160,	Order:0x2201,	Replacements:[L.Text("Unit.Emit")],	},	// 約35回
		Many03			:{	IsPublic:true,	Count:170,	Order:0x2202,	Replacements:[L.Text("Unit.Emit")],	},	// 約42回
		Many04			:{	IsPublic:true,	Count:180,	Order:0x2203,	Replacements:[L.Text("Unit.Emit")],	},	// 約50回
	};
	//チェックポイント到達
	Achievements.Check	= {
		Venus			:{	IsPublic:true,	Count:1,	Order:0x3300,	Replacements:[C.Check.Venus,  L.Text("Unit.Distance")],	},	//金星
		Mars			:{	IsPublic:true,	Count:1,	Order:0x3301,	Replacements:[C.Check.Mars,   L.Text("Unit.Distance")],	},	//火星
		Mercury			:{	IsPublic:true,	Count:1,	Order:0x3302,	Replacements:[C.Check.Mercury,L.Text("Unit.Distance")],	},	//水星
		Sun				:{	IsPublic:true,	Count:1,	Order:0x3303,	Replacements:[C.Check.Sun,    L.Text("Unit.Distance")],	},	//太陽
		Kirari			:{	IsPublic:true,	Count:1,	Order:0x3304,	Replacements:[C.Check.Kirari, L.Text("Unit.Distance")],	},	//諸星きらり
		Unicorn			:{	IsPublic:true,	Count:1,	Order:0x3305,	Replacements:[C.Check.Unicorn,L.Text("Unit.Distance")],	},	//ピンクのユニコーン
	};
	//ユーザアクション
	Achievements.Action	= {
		Complete		:{	IsPublic:true,	Count:1,	Order:0x0000,	Replacements:null,	},	//コンプリート
		FirstPlay		:{	IsPublic:true,	Count:1,	Order:0x0001,	Replacements:null,	},	//初プレイ
		Share			:{	IsPublic:true,	Count:1,	Order:0x0002,	Replacements:null,	},	//シェア
	};


	//Keyプロパティの生成
	let nAchievements = 0;	//実績総数
	_(Achievements).forEach(
		(handles,category) =>	{
			nAchievements+=_.size(handles);
			_(handles).forEach(	(h,key) =>{
				h.Key	= `Achievement.${category}.${key}`;
				h.Order	= h.Order || 0;
				h.Page	= Math.trunc(h.Order/(16**3));
			});
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
		this._nItems	= null;
		this._nPages	= null;

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
			{Key:achievement.Key},
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
		if(this._nItems!==null)	return this._nItems;
		return this.GetHandles().length;
	}

	get nUnlockedItems(){
		let n	= 0;
		_(Achievements).forEach(category=>{
			_(category).forEach(a=>{
				const date = cc.sys.localStorage.getItem(a.Key);
				if(date!==null && 0<date) ++n;
			});
		});
		return n;
	}

	/** 実績のハンドル一覧を得る */
	GetHandles(page=null){
		let results	= [];

		_(Achievements).forEach(category=>{	//カテゴリ舞のループ
			_(category)
				.filter(h=> page===undefined || page===null || Math.abs(page)==h.Page)
				.forEach(h=>results.push(h));
		});

		return _.orderBy(results,"Order");
	}

	/** ページ数
	 * @readonly
	 */
	get NumPages(){
		if(this._nPages!==null)	return this._nPages;

		return 1 + this.GetHandles().reduce(
			(result,handle)=> Math.max(result,handle.Page),	0
		);
	}

})();



