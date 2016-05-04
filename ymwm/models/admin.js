var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
function Admin(data) {
    this.username = data.username||"";
    this.password = data.password||'';
    this.email = data.email||'';
}

//�洢�û���Ϣ
Admin.prototype.save = function(callback) {
    //Ҫ�������ݿ��֧�ֶ���
    var admin = {
        username: this.username,
        password: this.password,
        email: this.email
    };
    //�����ݿ�
    db.open(function (err, db) {
        if (err) {
            return callback(err); //����?����err��Ϣ
        }
        //��ȡ customs ����
        db.collection('admin', function (err, collection) {
            if (err) {
                db.close();
                return callback(err); //����?��?err ��Ϣ
            }
            //���û����ݲ���order ����
            collection.insert(admin, {
                safe: true
            }, function (err) {
                db.close();
                if (err) {
                    return callback(err); //����?��?err ��Ϣ
                }
                callback(null); //�ɹ���errΪnull�������ش洢����û��ĵ�
            });
        });
    });
};
module.exports = Admin;