var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
function Money(money) {
    this.selfid = new ObjectID().toString();
    this.username = money.username||"";
    this.money = money.money||0;
    this.date = money.date||"";
}

//存储用户信息
Money.prototype.save = function(callback) {
    //要存入数据库的支持订单
    var money = {
        selfid: this.selfid,
        username: this.username,
        money: this.money,
        date: this.date

    };
    //打开数据库
    db.open(function (err, db) {
        if (err) {
            return callback(err); //错误?返回err信息
        }
        //读取 customs 集合
        db.collection('money', function (err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误?返?err 信息
            }
            //将用户数据插如order 集合
            collection.insert(money, {
                safe: true
            }, function (err, money) {
                db.close();
                if (err) {
                    return callback(err); //错误?返?err 信息
                }
                callback(null); //成功！err为null，并返回存储后的用户文档
            });
        });
    });
};
//根据用户名查找记录
Money.getAll = function(username, callback) {
    //打开数据库
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返?err 信息
        }
        db.collection('money', function (err, collection) {
            if(err) {
                db.close();
                return callback(err);
            }
            collection.find({}).toArray(function (err, money) {
                if (err) {
                    return callback(err);
                }
                callback(null,money);
            });
        });
    });
};

//根据用户名查找记录
Money.getByUsername = function(username, callback) {
    //打开数据库
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返?err 信息
        }
        //读取 order 集合
        db.collection('money', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返?err 信息
            }
            //查找用户名（name键）值为 name 一个文?
            collection.find({
                'username': username
            }, function(err, money) {
                db.close();
                if (err) {
                    return callback(err); //失败！返?err 信息
                }
                console.log(money);
                callback(null, money); //成功！返回查询的用户信息
            });
        });
    });
};

//充值记录
Money.getIn = function(username, callback) {
    //打开数据库
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返?err 信息
        }
        //读取 order 集合
        db.collection('money', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返?err 信息
            }
            //查找用户名（name键）值为 name 一个文?
            collection.find({
                'money': {'$gt':0}
            }, function(err, money) {
                db.close();
                if (err) {
                    return callback(err); //失败！返?err 信息
                }
                console.log(money);
                callback(null, money); //成功！返回查询的用户信息
            });
        });
    });
};

//提现记录
Money.getOut = function(username, callback) {
    //打开数据库
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返?err 信息
        }
        //读取 order 集合
        db.collection('money', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返?err 信息
            }
            //查找用户名（name键）值为 name 一个文?
            collection.find({
                'money': {'$lt':0}
            }, function(err, money) {
                db.close();
                if (err) {
                    return callback(err); //失败！返?err 信息
                }
                console.log(money);
                callback(null, money); //成功！返回查询的用户信息
            });
        });
    });
};

module.exports = Money;
