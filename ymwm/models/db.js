
var mongo = require('mongodb'),
    host = "localhost",
    port = 27017,
    server = new mongo.Server(host, port, {auto_reconnect:true}),
    db =  mongo.Db('yimengweima',server,{safe:true});

module.exports = db;
 
 	

 