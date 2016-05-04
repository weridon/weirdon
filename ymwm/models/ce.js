var User = require('./user.js');
var username = "liuwei";
var password = "123456";
User.get(username, function (err, user) {
    console.log(user);

});