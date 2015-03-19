var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

//(S3) I can sign up.
//The function takes the email of the user as an input.
//and it creates a new user.
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