var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');


exports.createUser  = function (email) {
    db.query("CREATE (:User { email:{ep} })", params = {ep:email}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}
exports.createResturant  = function (name) {
    db.query("CREATE (:Restaurant { name:{np} })", params = {np:name}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}