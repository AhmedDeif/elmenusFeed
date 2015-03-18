var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');


exports.createResturant  = function (name) {
    db.query("CREATE (:Restaurant { name:{np} })", params = {np:name}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });


    //6-I can like a dish in a specific restaurant.
    // The function takes an email, Dish name and a restaurant name and match the user and restaurant and the dish.
    // Then it creates a Relation HAS between dish and restaurant and a LIKED Relation between the user and a dish.
exports.createrLikeUserDish  = function (UserEmail,DishName,RestaurantName) {
     db.query("MATCH (user:User {email: {ep}}), (dish:Dish {dish_name: {dnp}}),(r:Restaurant {name:{rp}}) CREATE (user)-[:LIKES_DISH]->(dish)<-[:has]-(r) WITH user,dish MATCH (user)-[x:DISLIKES_DISH]->(dish)<-[:has]-(r) DELETE x", 
     	params = {ep:UserEmail,dnp:DishName,rp:RestaurantName}, function (err, results) {
        if (err) throw err;
        console.log('done');
    });
}

}