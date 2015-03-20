var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');


exports.createResturant  = function (name) {
    db.query("CREATE (:Restaurant { name:{np} })",
     params = {np:name}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

//2-I can add a dish to the resturant TESTED
exports.createDish  = function (name) {
    db.query("CREATE (:Dish { dish_name:{np} })",
     params = {np:name}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}
exports.addDishToRestaurant  =
 function (dish,restaurant) {
    db.query("MATCH (d:Dish),(r:Restaurant) WHERE 
        d.dish_name={dp} AND r.name ={rp} CREATE 
        (r)-[rl:HAS_DISH]->(d)", params = 
        {dp:dish,rp:restaurant},
         function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

/* Sprint #-0-US-18
    createFollowUser(FollowerEmail, FolloweeEmail):
    This function takes as an input the email of 
    the user that is requesting to follow another
    user, and the email of the other user that is
    being requested to be followed, then checks
    that these two emails are not the same (a user
    cannot follow his/herself). Finally, it creates
    the corresponding FOLLOWS relationship between
    these two users.
*/
exports.createFollowUser = function (FollowerEmail,FolloweeEmail) {
    db.query("MATCH (d:User),(r:User)  WHERE 
        d.email={e1p} AND r.email = {e2p} AND 
        d.email <> r.email   CREATE (d)-[f:FOLLOWS]
        ->(r)", params = {e1p:FollowerEmail
            ,e2p:FolloweeEmail}
            , function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}