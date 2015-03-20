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

/* Sprint #-0-US-2
    createDish(name):
    This function takes as input the dish's 
    name and creates the corresponding dish in the
    database using a CYPHER CREATE query.
*/
exports.createDish  = function (name) {
    db.query("CREATE (:Dish { dish_name:{np} })", params = {np:name}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}
/*  Sprint #-0-US-2
     addDishToRestaurant(dish, restaurant):
     this function takes as input the dishs and
     the restaurants name and creates the
     corresponding 'Has' relationship between this
     dish and this restaurant.
*/
exports.addDishToRestaurant  = function (dish,restaurant) {
    db.query("MATCH (d:Dish),(r:Restaurant) WHERE d.dish_name={dp} AND r.name ={rp} CREATE (r)-[rl:Has]->(d)", params = {dp:dish,rp:restaurant}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}