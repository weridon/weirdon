var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
function Admin(data) {
    this.username = data.username||"";
    this.password = data.password||'';
    this.email = data.email||'';
}

//存储用户信息
Admin.prototype.save = function(callback) {
    //要存入数据库的支持订单
    var admin = {
        username: this.username,
        password: this.password,
        email: this.email
    };
    //打开数据库
    db.open(function (err, db) {
        if (err) {
            return callback(err); //错误?返回err信息
        }
        //读取 customs 集合
        db.collection('admin', function (err, collection) {
            if (err) {
                db.close();
                return callback(err); //错误?返?err 信息
            }
            //将用户数据插如order 集合
            collection.insert(admin, {
                safe: true
            }, function (err) {
                db.close();
                if (err) {
                    return callback(err); //错误?返?err 信息
                }
                callback(null); //成功！err为null，并返回存储后的用户文档
            });
        });
    });
};
module.exports = Admin;