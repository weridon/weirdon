var db = require ('./db');


function Test(name,age){
    this.name = name;
    this.age = age;
}

module.exports = Test;

//存取用户信息
Test.prototype.save = function() {
    var test = {
        name: this.name,
        age:this.age
    };
    //打开数据库
    db.open(function (err, db) {
        if (err) {
            throw err;
        }
        //读取 articles 集合
        db.collection('users', function (err, collection) {
            if (err) {
                db.close();
                console.log("db close")
            }
            //将文档插入 messages 集合
            collection.insert(test, {
                safe: true
            }, function (err,docs) {
                db.close();
                if (err) {
                    throw err;//失败！返回 err
                }
                console.log(docs);//返回 err 为 null
            });
        });
    });
};
