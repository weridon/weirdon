var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
function Project(project) {
	this.selfid = new ObjectID().toString();
	this.username = project.username||'暂无';
	this.idcard = project.idcard||'暂无';
	this.tele = project.tele||'暂无';
	this.address = project.address||'暂无';
	this.proType = project.proType||'暂无';
	this.proName = project.proName||'暂无';
	this.proTitle = project.proTitle||'暂无';
	this.goalMoney = project.goalMoney||0;
	this.during = project.during||'1';
	this.proDescribe = project.proDescribe||'暂无';
	this.currentMoney = project.currentMoney||0 ; //已筹金额
	this.proRisk = project.proRisk||'暂无';
	this.startTime = project.startTime||'暂无';
	this.finishTime = 0;
	this.supportNum = project.supportNum||0;      //支持人数
	this.attentionNum = project.attentionNum||0;  //关注人数
	this.support = project.support||[];    //支持者
	this.attention = project.attention||[]; //关注者
	this.perSupport = {
		payBack1 :
		{
			pbMoney:project.perSupport.payBack1.pbMoney||'',
			pbTitle:project.perSupport.payBack1.pbTitle||'暂无',
			pbCon:project.perSupport.payBack1.pbCon||'暂无'
		},
		payBack2:
		{
			pbMoney:project.perSupport.payBack2.pbMoney||'',
			pbTitle:project.perSupport.payBack2.pbTitle||'暂无',
			pbCon:project.perSupport.payBack2.pbCon||'暂无'
		},
		payBack3:
		{
			pbMoney:project.perSupport.payBack3.pbMoney||'',
			pbTitle:project.perSupport.payBack3.pbTitle||'暂无',
			pbCon:project.perSupport.payBack3.pbCon||'暂无'
		}
	}||{}; //回报
	this.img = project.img||'[\"noimg.jpg\"]';
	this.isCheck = 0;    //项目是否通过审核
	this.proTrend = [];  //项目动态
	this.isGrant = 0;    //资金发放状态 0未发放 1已发放 2已返还
	this.proAccount = 0; //已发放金额
}
//存储项目信息
Project.prototype.save = function (callback) {
	function finishT(dur){
		var now = new Date();
		var n = now.getDate();
		var d = parseInt(dur);
		now.setDate(n+d);
		return now;
	}
	//要存入数据库的文�
	var project = {
		selfid : this.selfid ,
		username:this.username,
		idcard:this.idcard,
		tele:this.tele,
		address:this.address,
	    proName : this.proName,
		proTitle : this.proTitle,
	    proType :this.proType,
		during : this.during,
		goalMoney : Number(this.goalMoney),
		proDescribe	 : this.proDescribe,
		proRisk : this.proRisk,
		startTime : this.startTime,
		finishTime:finishT(this.during),
		currentMoney : this.currentMoney? this.currentMoney:0,
		supportNum : this.supportNum?this.supportNum:0,
		attentionNum : this.attentionNum,
		support:this.support,
		attention:this.attention,
		img : this.img,
		isCheck:this.isCheck,
		perSupport:{
			payBack1 : {
				pbMoney:this.perSupport.payBack1.pbMoney,
				pbTitle:this.perSupport.payBack1.pbTitle,
				pbCon:this.perSupport.payBack1.pbCon
			},
			payBack2 : {
				pbMoney:this.perSupport.payBack2.pbMoney,
				pbTitle:this.perSupport.payBack2.pbTitle,
				pbCon:this.perSupport.payBack2.pbCon
			},
			payBack3 :{
				pbMoney:this.perSupport.payBack3.pbMoney,
				pbTitle:this.perSupport.payBack3.pbTitle,
				pbCon:this.perSupport.payBack3.pbCon
			}
		},
		proTrend:this.proTrend,
		isGrant:this.isGrant,
		proAccount:this.proAccount
	};
	//打开数据�
	db.open(function(err, db) {
		if (err) {
			return callback(err); //错误�返回err信息
		}
		//读取 project 集合
		db.collection('project', function(err, collection) {
			if (err) {
				db.close();
				return callback(err); //错误�返�err 信息
			}
			//将用户数据插�project 集合
			collection.insert(project, {
				safe: true
			}, function (err, project) {
				db.close();
				if (err) {
					return callback(err); //错误�返�err 信息
				}
				callback(null,project); //成功！err为null，并返回存储后的用户文档
			});
		});
	});
};
//获取项目统计信息
Project.getTotalInfo = function(callback) {
	//打开数据�
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({}).toArray(function (err, project) {
				if (err) {
					return callback(err);
				}
				var totalInfo = {};
				var pro= project.length;
				var money = 0,user = 0;
				for(var i = 0;i<pro;i++){
					money = money+Number(project[i].currentMoney);
					user = user+Number(project[i].supportNum);
				}
				totalInfo.pro = pro;
				totalInfo.user = user;
				totalInfo.money = money;
				callback(null,totalInfo);
			});
		});
	});
};
//获取全部项目信息
Project.getAll = function(callback) {
	//打开数据�
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({}).toArray(function (err, project) {
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//获取全部审核通过项目信息
Project.get = function(callback) {
	//打开数据�
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({'isCheck':1}).toArray(function (err, project) {
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//获取已完成项�
Project.getOver = function(callback) {
	//打开数据�
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({'isCheck':1}).toArray(function (err, project) {
				db.close();
				if (err) {
					return callback(err);
				}
				var finishpro = [];
				for(var i= 0,len=project.length;i<len;i++){
					console.log('cm'+project[i].currentMoney);
					console.log('gm'+project[i].goalMoney);
					if(project[i].currentMoney >= project[i].goalMoney || project[i].finishTime <= new Date()){
						finishpro.push(project[i]);
					}
				}
				console.log(finishpro);
				callback(null,finishpro);
			});
		});
	});
};
//关注项目
Project.payAttention = function(proId,username ,callback) {

	//打开数据�
	db.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 project 集合
		db.collection('project', function (err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			//更新项目已筹金额与支持人�
			collection.update({
				"selfid": proId
			}, {
				$inc: {
					attentionNum: 1
				},
				$addToSet: {
					"attention": username
				}
			}, function (err) {
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};
//支持项目
Project.supportPro= function(proId,userData, callback) {

	//打开数据�
	db.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 project 集合
		db.collection('project', function (err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			//更新项目已筹金额与支持人�
			collection.update({
				"selfid": proId
			}, {
				$inc: {
					"supportNum": 1,
					"currentMoney":Number(userData.money)
				},
				$push:{
					"support":userData
				}
			}, function (err) {
				if (err) {

					return callback(err);
				}
				callback(null);
			});
		});
	});
};
//删除项目信息
Project.delete = function(_id,callback){
	db.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
		
			}
		collection.remove({
                "selfid": _id
            },{
            	w:1
            },function(err){
                db.close();
                if (err) {
                    return callback(err);//失败！返�err
                }
                callback(null);//成功
            });
		});
	});
};
//按发起时间降序排列，取最晚的一个项�
Project.findLastOne = function(callback){
	db.open(function(err,db){
		if(err) {
			return callback(err);
		}
		db.collection('project',function(err,collection){
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({}).sort({'startTime':-1}).toArray(function (err, project) {
				db.close();
				if (err) {
					return callback(err);
				}
				console.log(project);
				callback(null,project[0].selfid);
			});
		});
	});
};
//获取所有project及id
Project.getProAndId = function(callback) {
	//打开数据�
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({'isCheck':1}).toArray(function (err, project) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//根据id获取项目
Project.findProById = function(proid,callback) {
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.findOne({selfid:proid},function (err, project) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//根据项目类型获取项目
Project.findProByType = function(protype,callback) {
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({'proType':protype,'isCheck':1}).toArray(function (err,project) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//获取正在进行的项�
Project.findRaisingPro = function(callback) {
	//打开数据�
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({'isCheck':1}).toArray(function (err, project) {
				db.close();
				if (err) {
					return callback(err);
				}
				var raisingpro = [];
				for(var i= 0,len=project.length;i<len;i++){
					if(project[i].goalMoney > project[i].currentMoney && project[i].finishTime > new Date()){
						raisingpro.push(project[i]);
					}
				}
				callback(null,raisingpro);
			});
		});
	});
};
//按发起时间降序排�
Project.findProOrderDown = function(callback){
	db.open(function(err,db){
		if(err) {
			return callback(err);
		}
		db.collection('project',function(err,collection){
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({'isCheck':1}).sort({'_id':-1}).toArray(function (err, project) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//按项目金额降序排�
Project.findProMoneyDown = function(callback){
	db.open(function(err,db){
		if(err) {
			return callback(err);
		}
		db.collection('project',function(err,collection){
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({'isCheck':1}).sort({'goalMoney':-1}).toArray(function (err, project) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//获取用户发起的所有项�
Project.getUserAllPro = function(username,callback){
	//打开数据�
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({'username':username}).toArray(function (err, project) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//存储项目动�
Project.saveProTrend = function(proid,protrend,callback){
	//打开数据�
	db.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 project 集合
		db.collection('project', function (err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			//更新项目动�
			collection.update({
				"selfid": proid
			}, {
				$push:{
					proTrend:protrend
				}
			}, function (err) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};
//更改项目审核状�
Project.updateCheck = function(proid,isCheck,callback){
	//打开数据�
	db.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 project 集合
		db.collection('project', function (err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			//更新项目动�
			collection.updateOne(
				{"selfid": proid},
				{$set: {isCheck:Number(isCheck)}
			}, function (err) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};
//按项目状态筛�
Project.findProByState = function(state,callback){
	db.open(function(err,db){
		if(err) {
			return callback(err);
		}
		db.collection('project',function(err,collection){
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({'isCheck':Number(state)}).toArray(function (err, project) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//查找审核通过的项目
Project.findCheckPass = function(callback){
	db.open(function(err,db){
		if(err) {
			return callback(err);
		}
		db.collection('project',function(err,collection){
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({'isCheck':1}).toArray(function (err, project) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//更新项目发放回报状态
Project.updateGrant = function(proid,state,callback){
	db.open(function(err,db){
		if(err) {
			return callback(err);
		}
		db.collection('project',function(err,collection){
			if(err) {
				db.close();
				return callback(err);
			}
			collection.updateOne({
				"selfid":proid
			}, {
				$set: {
					isGrant:Number(state)
				}
			},function (err) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
}
//后台管理-根据资金发放状态筛选项目
Project.findProByGrant = function(type,callback){
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.find({isGrant:Number(type)}).toArray(function (err,project) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null,project);
			});
		});
	});
};
//更新项目账户金额
Project.updateProAccount = function(proid,mny,callback){
	db.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('project', function (err, collection) {
			if(err) {
				db.close();
				return callback(err);
			}
			collection.updateOne({
				"selfid":proid
			},{
				$inc:{proAccount:Number(mny)}
			},function (err) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
}
module.exports = Project;
