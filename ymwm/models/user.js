var db = require('./db');
var ObjectID = require('mongodb').ObjectID;

function User(user) {
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.tele = user.tele||"";
    this.sex  = user.sex||0;
    this.userImg = user.userImg||"";
    this.intro = user.intro||"";
    this.isRealName = user.isRealName||0;
    this.realName = user.realName||"";
    this.idCard = user.idCard||"";
    this.idCardImg = user.idCardImg||[];
    this.isBindBank =  user.isBindBank||0;
    this.dealPassword = user.dealPassword||"";
    this.bankName = user.bankName||"";
    this.bankNum = user.bankNum||"";
    this.support = user.support||[];
    this.attention = user.attention||[];
    this.isUsed = user.isUsed||0;
    this.moneyAccount = user.moneyAccount||0;
    this.proMoneyAccount = user.proMoneyAccount||0;
    this.address = [];

}

//存储用户信息
User.prototype.save = function(callback) {
    //要存入数据库的用户文�
    var user = {
        username: this.username,
        password: this.password,
        email: this.email,
        tele: this.tele,
        sex: this.sex,
        userImg: this.userImg,
        intro: this.intro,
        isRealName: this.isRealName,
        realName: this.realName,
        idCard: this.idCard,
        idCardImg: this.idCardImg,
        isBindBank: this.isBindBank,
        dealPassword:this.dealPassword,
        bankName: this.bankName,
        bankNum: this.bankNum,
        support:this.support,
        attention:this.attention,
        isUsed: this.isUsed,
        moneyAccount:this.moneyAccount,
        proMoneyAccount:this.proMoneyAccount,
        address:[{
            recipient : this.address.recipient||'',
            tele : this.address.tele||'',
            address : this.address.address||'',
            postcode : this.address.postcode||''
        }]
    };
    //打开数据�
     db.open(function (err, db) {
        if (err) {
            return callback(err); //错误�返回err信息
        }
        //读取 customs 集合
        db.collection('user', function (err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误�返�err 信息
            }
            //将用户数据插�users 集合
            collection.insert(user, {
                safe: true
            }, function (err, user) {
                db.close();
                if (err) {
                    return callback(err); //错误�返�err 信息
                }
                callback(null); //成功！err为null，并返回存储后的用户文档
            });
        });
    });
};

//根据用户名读取用户信�
User.get = function(username, callback) {
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //查找用户名（name键）值为 name 一个文�
            collection.findOne({
                'username': username
            }, function(err, user) {
                db.close();
                if (err) {
                    return callback(err); //失败！返�err 信息
                }
                console.log(user);
                callback(null, user); //成功！返回查询的用户信息
            });
        });
    });
};

//修改用户基本资料
User.editUserinfo = function(userData,callback) {
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //更新用户基本信息
            collection.update({
                "username": userData.username
            }, {
                $set: {
                    userImg: userData.userImg,
                    sex: userData.sex,
                    intro:userData.intro
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
//实名认证填写
User.editRealName = function(userData,callback) {
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //更新用户基本信息
            collection.update({
                "username": userData.username
            }, {
                $set: {
                    isRealName: userData.isRealName,
                    realName: userData.realName,
                    idCard:userData.idCard
                },
                $push:{
                    idCardImg:userData.idCardImg
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
//银行信息填写
User.editBindBank = function(userData,callback) {
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //更新用户基本信息
            collection.update({
                "username": userData.username
            }, {
                $set: {
                    isBindBank: userData.isBindBank,
                    dealPassword:userData.dealPassword,
                    bankName: userData.bankName,
                    bankNum:userData.bankNum
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
//获取全部用户信息
User.getAll = function(callback){
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //查找用户名（name键）值为 name 一个文�
            collection.find({}).toArray(function(err, user) {
                db.close();
                if (err) {
                    return callback(err); //失败！返�err 信息
                }
                console.log(user);
                callback(null, user); //成功！返回查询的用户信息
            });
        });
    });
};
//根据用户名修改信息审核状�
User.updateCheck = function(username,state,callback){
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //更新用户基本信息
            collection.updateOne(
                {"username": username},
                {$set: {isUsed: Number(state)}
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
//修改密码
User.editPassword = function(username,oldPwd,newPwd,callback) {
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        var oldpassword;
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            collection.update({
                "username": username,
                "password":oldPwd
            }, {
                $set: {
                    "password": newPwd
                }
            },{ upsert: false}, function (err,result) {
                db.close();
                console.log(result.result);
                if (err) {
                    return callback(err);
                }
                callback(null,result);
            });
        });

    });
};
//修改地址
User.editAddress = function(username,adsData,callback) {
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            collection.update({
                "username": username
            }, {
                $set: {
                    "address": adsData
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
//删除一条用户信�
User.deleteOne = function(username,callback){
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //查找用户名（name键）值为 name 一个文�
            collection.deleteOne({
                'username': username
            }, function(err) {
                db.close();
                if (err) {
                    return callback(err); //失败！返�err 信息
                }
                callback(null); //成功�
            });
        });
    });
};
//根据用户审核状态筛�
User.findUserByState = function(state,callback){
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //查找用户名（name键）值为 name 一个文�
            collection.find({
                'isUsed': state
            }).toArray(function(err,user) {
                db.close();
                if (err) {
                    return callback(err); //失败！返�err 信息
                }
                callback(null, user); //成功！返回查询的用户信息
            });
        });
    });
};
//查找一个用�
User.findOneUser = function(username,callback){
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //查找用户名（name键）值为 name 一个文�
            collection.findOne({
                'username': username
            },function(err,user) {
                db.close();
                if (err) {
                    return callback(err); //失败！返�err 信息
                }
                callback(null, user); //成功！返回查询的用户信息
            });
        });
    });
};
//关注项目
User.payAttention = function(username,proId,callback){
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //关注项目
            collection.update({
                "username": username
            }, {
                $addToSet: {
                    "attention": proId
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
//支持项目
User.supportPro = function(username,dealPassword,supportData,callback){

    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //关注项目
            collection.update({
                "username": username,
                "dealPassword":dealPassword
            }, {
                $push: {
                    "support": supportData
                }
            },{ upsert: false}, function (err,result) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null,result);
            });
        });
    });
};
//账户充值
User.recharge = function(username,password,money,callback){
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //关注项目
            collection.update({
                "username": username,
                "dealPassword": password
            }, {
                $inc: {
                    "moneyAccount": Number(money)
                }
            },{ upsert: false}, function (err,result) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null,result);
            });
        });
    });
};
//更新账户金额
User.updateAccount = function(username,money,callback){
    //打开数据�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 users 集合
        db.collection('user', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //关注项目
            collection.update({
                "username": username
            }, {
                $inc: {
                    "moneyAccount": Number(money)
                }
            },{ upsert: false}, function (err,result) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

module.exports = User;