var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
function Money(money) {
    this.selfid = new ObjectID().toString();
    this.username = money.username||"";
    this.money = money.money||0;
    this.date = money.date||"";
}

//�洢�û���Ϣ
Money.prototype.save = function(callback) {
    //Ҫ�������ݿ��֧�ֶ���
    var money = {
        selfid: this.selfid,
        username: this.username,
        money: this.money,
        date: this.date

    };
    //�����ݿ�
    db.open(function (err, db) {
        if (err) {
            return callback(err); //����?����err��Ϣ
        }
        //��ȡ customs ����
        db.collection('money', function (err, collection) {
            if (err) {
                db.close();
                return callback(err); //����?��?err ��Ϣ
            }
            //���û����ݲ���order ����
            collection.insert(money, {
                safe: true
            }, function (err, money) {
                db.close();
                if (err) {
                    return callback(err); //����?��?err ��Ϣ
                }
                callback(null); //�ɹ���errΪnull�������ش洢����û��ĵ�
            });
        });
    });
};
//�����û������Ҽ�¼
Money.getAll = function(username, callback) {
    //�����ݿ�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //���󣬷�?err ��Ϣ
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

//�����û������Ҽ�¼
Money.getByUsername = function(username, callback) {
    //�����ݿ�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //���󣬷�?err ��Ϣ
        }
        //��ȡ order ����
        db.collection('money', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //���󣬷�?err ��Ϣ
            }
            //�����û�����name����ֵΪ name һ����?
            collection.find({
                'username': username
            }, function(err, money) {
                db.close();
                if (err) {
                    return callback(err); //ʧ�ܣ���?err ��Ϣ
                }
                console.log(money);
                callback(null, money); //�ɹ������ز�ѯ���û���Ϣ
            });
        });
    });
};

//��ֵ��¼
Money.getIn = function(username, callback) {
    //�����ݿ�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //���󣬷�?err ��Ϣ
        }
        //��ȡ order ����
        db.collection('money', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //���󣬷�?err ��Ϣ
            }
            //�����û�����name����ֵΪ name һ����?
            collection.find({
                'money': {'$gt':0}
            }, function(err, money) {
                db.close();
                if (err) {
                    return callback(err); //ʧ�ܣ���?err ��Ϣ
                }
                console.log(money);
                callback(null, money); //�ɹ������ز�ѯ���û���Ϣ
            });
        });
    });
};

//���ּ�¼
Money.getOut = function(username, callback) {
    //�����ݿ�
    db.open(function(err, db) {
        if (err) {
            return callback(err); //���󣬷�?err ��Ϣ
        }
        //��ȡ order ����
        db.collection('money', function(err, collection) {
            if (err) {
                db.close();
                return callback(err); //���󣬷�?err ��Ϣ
            }
            //�����û�����name����ֵΪ name һ����?
            collection.find({
                'money': {'$lt':0}
            }, function(err, money) {
                db.close();
                if (err) {
                    return callback(err); //ʧ�ܣ���?err ��Ϣ
                }
                console.log(money);
                callback(null, money); //�ɹ������ز�ѯ���û���Ϣ
            });
        });
    });
};

module.exports = Money;
