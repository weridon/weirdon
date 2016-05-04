var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
function Order(order) {
    this.selfid = new ObjectID().toString();
    this.username = order.username||"";
    this.proId = order.proId||"";
    this.money = order.money||0;
    this.date = order.date||"";
}

//存储记录
Order.prototype.save = function(callback) {
    //要存入数据库的支持订单
    var order = {
        selfid: this.selfid,
        username: this.username,
        proId: this.proId,
        money: this.money,
        date: this.date
    };
    //打开数据库
    db.open(function (err, db) {
        if (err) {
            return callback(err); //错误�返回err信息
        }
        //读取 customs 集合
        db.collection('order', function (err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误�返�err 信息
            }
            //将用户数据插如order 集合
            collection.insert(order, {
                safe: true
            }, function (err, order) {
                db.close();
                if (err) {
                    return callback(err); //错误�返�err 信息
                }
                callback(null); //成功！err为null，并返回存储后的用户文档
            });
        });
    });
};

//查找所有记录
Order.getAllOrder = function(username, callback) {
    //打开数据库
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 order 集合
        db.collection('order', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //查找用户名（name键）值为 name 一个文�
            collection.find({
            }, function(err, order) {
                db.close();
                if (err) {
                    return callback(err); //失败！返�err 信息
                }
                console.log(order);
                callback(null, order); //成功！返回查询的用户信息
            });
        });
    });
};
//根据用户名查找记录
Order.getOrderByUsername = function(username, callback) {
    //打开数据库
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 order 集合
        db.collection('order', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //查找用户名（name键）值为 name 一个文�
            collection.find({
                'username': username
            }, function(err, order) {
                db.close();
                if (err) {
                    return callback(err); //失败！返�err 信息
                }
                console.log(order);
                callback(null, order); //成功！返回查询的用户信息
            });
        });
    });
};

//根据项目名查找记录
Order.getOrderByProId = function(proId, callback) {
    //打开数据库
    db.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返�err 信息
        }
        //读取 order 集合
        db.collection('order', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误，返�err 信息
            }
            //查找用户名（name键）值为 name 一个文�
            collection.find({
                'proId': proId
            }, function(err, order) {
                db.close();
                if (err) {
                    return callback(err); //失败！返�err 信息
                }
                console.log(order);
                callback(null, order); //成功！返回查询的用户信息
            });
        });
    });
};
module.exports = Order;