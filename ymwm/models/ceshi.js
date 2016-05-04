var db = require('./db');
    User = require('./user');
 var peo = {
	"username":"lily",
	"password":321456
}
var c = new User(peo);
c.save();
   