var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');


exports.createResturant  = function (name) {
    db.query("CREATE (:Restaurant { name:{np} })", params = {np:name}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

//14-I can add a restaurant to favourites.
//The function takes as inputs the email of the user and the name of the restaurant 
//and it gets the nodes of the restaurant and the user and creates a new relation called FAVORITES between the two nodes.
exports.createrFavouriteUserRestaurant  = function (email,RestaurantName) {
    db.query("MATCH (user:User {email: {ep}}), (rest:Restaurant {name: {rp}}) CREATE (user)-[:FAVORITES]->(rest);",
     params = {ep:email,rp:RestaurantName}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}