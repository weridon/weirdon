var db = require ('./db');


function Test(name,age){
    this.name = name;
    this.age = age;
}

module.exports = Test;

//��ȡ�û���Ϣ
Test.prototype.save = function() {
    var test = {
        name: this.name,
        age:this.age
    };
    //�����ݿ�
    db.open(function (err, db) {
        if (err) {
            throw err;
        }
        //��ȡ articles ����
        db.collection('users', function (err, collection) {
            if (err) {
                db.close();
                console.log("db close")
            }
            //���ĵ����� messages ����
            collection.insert(test, {
                safe: true
            }, function (err,docs) {
                db.close();
                if (err) {
                    throw err;//ʧ�ܣ����� err
                }
                console.log(docs);//���� err Ϊ null
            });
        });
    });
};
