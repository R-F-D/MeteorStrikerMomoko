/********************************************************************************
	実績
********************************************************************************/
var cc,_;
var L,C;
var Store;

const Achievements = (()=>{		//Achievements scoop
	let Achievements={};

	//エイミング精度
	Achievements.Aiming	= {
		ManyPerfect		:{	IsPublic:true,	Count:3,	Order:0x2000,	Rank:1,	Replacements:[],	},	//パーフェクト
		ManyGood		:{	IsPublic:true,	Count:4,	Order:0x2001,	Rank:0,	Replacements:[],	},	//グッド以上
		TruePerfect		:{	IsPublic:true,	Count:100,	Order:0x2002,	Rank:2,	Replacements:null,	},	//100%パーフェクト
	};
	//打撃力
	Achievements.Blowing	= {
		ManyHard		:{	IsPublic:true,	Count:5,	Order:0x3100,	Rank:0,	Replacements:[],	},	//強打
		HardAndPerfect	:{	IsPublic:true,	Count:3,	Order:0x3101,	Rank:1,	Replacements:[],	},	//強打でパーフェクト
		SuccessiveHits	:{	IsPublic:true,	Count:19,	Order:0x3102,	Rank:1,	Replacements:[],	},	//連続ヒット
	};
	//エミット
	Achievements.Emit	= {
		Many01			:{	IsPublic:true,	Count:160,	Order:0x4200,	Rank:0,	Replacements:[()=>L.Text("Unit.Emit")],	},	// 約35回
		Many02			:{	IsPublic:true,	Count:170,	Order:0x4201,	Rank:0,	Replacements:[()=>L.Text("Unit.Emit")],	},	// 約42回
		Many03			:{	IsPublic:true,	Count:180,	Order:0x4202,	Rank:1,	Replacements:[()=>L.Text("Unit.Emit")],	},	// 約50回
	};
	//チェックポイント到達
	Achievements.Check	= {
		Venus			:{	IsPublic:true,	Count:1,	Order:0x5300,	Rank:0,	Replacements:[C.Check[1].distance, ()=>L.Text("Unit.Distance")],	},	//金星
		Mars			:{	IsPublic:true,	Count:1,	Order:0x5301,	Rank:0,	Replacements:[C.Check[2].distance, ()=>L.Text("Unit.Distance")],	},	//火星
		Mercury			:{	IsPublic:true,	Count:1,	Order:0x5302,	Rank:0,	Replacements:[C.Check[3].distance, ()=>L.Text("Unit.Distance")],	},	//水星
		Sun				:{	IsPublic:true,	Count:1,	Order:0x6300,	Rank:1,	Replacements:[C.Check[4].distance, ()=>L.Text("Unit.Distance")],	},	//太陽
		Kirari			:{	IsPublic:false,	Count:1,	Order:0x6301,	Rank:1,	Replacements:[C.Check[5].distance, ()=>L.Text("Unit.Distance")],	},	//諸星きらり
		Unicorn			:{	IsPublic:false,	Count:1,	Order:0x6302,	Rank:2,	Replacements:[C.Check[6].distance, ()=>L.Text("Unit.Distance")],	},	//ピンクのユニコーン
	};
	//ユーザアクション
	Achievements.Action	= {
		Complete		:{	IsPublic:true,	Count:1,	Order:0x0000,	Rank:3,	Replacements:null,	},	//コンプリート
		FirstPlay		:{	IsPublic:true,	Count:1,	Order:0x0001,	Rank:0,	Replacements:null,	},	//初プレイ
		Share			:{	IsPublic:true,	Count:3,	Order:0x0002,	Rank:0,	Replacements:[],	},	//シェア
		PlayTime		:{	IsPublic:true,	Count:765,	Order:0x1000,	Rank:0,	Replacements:[],	},	//プレイ時間
		BootDays		:{	IsPublic:true,	Count:5,	Order:0x1001,	Rank:0,	Replacements:[],	},	//起動日数
		Monday9			:{	IsPublic:true,	Count:1,	Order:0x1002,	Rank:0,	Replacements:[],	},	//月曜日または9時台に起動
		TouchPlayer		:{	IsPublic:false,	Count:1,	Order:0x8000,	Rank:0,	Replacements:null,	},	//桃子だけど
		Navigate00		:{	IsPublic:true,	Count:10,	Order:0x7000,	Rank:0,	Replacements:[],	},	//ノーマルナビ使用
		Navigate01		:{	IsPublic:false,	Count:5,	Order:0x7001,	Rank:0,	Replacements:[],	},	//ゴーレムナビ使用
		Navigate02		:{	IsPublic:false,	Count:4,	Order:0x7002,	Rank:0,	Replacements:[],	},	//女神ナビ使用
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
		this._totalItems= null;
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
	Unlock(achievement,count,unlocksCompleteAchievement=true){
		if(achievement==null) return this;

		Store.Insert(
			{Key:achievement.Key},
			Scene.SceneBase.GetDate().getTime(),
			(oldValue,newValue)	=> oldValue===null && achievement.Count<=count,	//cond
			(key,value)			=> {
				const title	= Array.isArray(achievement.Replacements)	? L.Textf(key,[achievement.Count].concat(achievement.Replacements))
																		: L.Text (key);
				this.label.PushLog(`${L.Text("Achievement.Unlocked")}\n${title}`);
				Log(`Achievement: ${key}`);
			}
		);

		if(unlocksCompleteAchievement)	this.Complete();
		return this;
	}

	Complete(){
		this.Unlock(Achievements.Action.Complete,this.nUnlockedItems,false);
		return this;
	}

	SetLayer(layer){
		this.layer = layer;
		if(this.label){
			this.label.AddToLayer(layer);
			this.Complete();
		}
		return this;
	}

	/** 実績数を得る
	 * @param {number|null} [rank=null]	実績ランク（nullで全実績）
	 * @returns {number}				実績数
	 */
	GetNumItems(rank=null){
		if(rank===null){
			if(this._totalItems===null)	this._totalItems	= this.GetHandles().length;
			return this._totalItems;
		}
		else{
			if(this._nItems===null){
				this._nItems	= this._nItems || [];
				this.GetHandles().forEach(h=>{
					if(!this._nItems[h.Rank]) this._nItems[h.Rank]=0;
					++this._nItems[h.Rank];
				})
			}
			return this._nItems[rank] || 0;
		}
	}

	GetNumUnlockedItems(rank=null){
		let n	= 0;
		_(Achievements).forEach(category=>{
			_(category)
				.filter(a=>rank===null || a.Rank==rank)
				.forEach(a=>{
					const date = Store.Select(a.Key);
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



