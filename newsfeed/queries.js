var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');


//(S19) I can unfollow another user.
//This function takes two parameters :
//the follower email and the current user email
//then it matches the two users and deletes the relationship follow between them
exports.deleterFollowUserUser  = function (FollowerEmail,FolloweeEmail) {
    db.query("MATCH (d)-[rel:Follows]->(r)  WHERE d.email={e1p} AND r.email={e2p}  DELETE rel", params = {e1p:FollowerEmail,e2p:FolloweeEmail}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}
//(S5) The function takes the following parameters:
//UserEmail, the restaurant name, the review title and the body of the review
//then it matches the user with the restaurant
//and adds the review to this restaurant
exports.createrReviewUserToRestaurant = function (UserEmail,RestaurantName,ReviewTitle,ReviewBody) {
    db.query("MATCH (n:User { email:{ep} }),(r:Restaurant { name:{rp} })CREATE (n) -[:Review { title:{tp} , body:{bp} }]-> (r) ;", params = {ep:UserEmail,rp:RestaurantName,tp:ReviewTitle,bp:ReviewBody}, function (err, results) {
        if (err){  console.log('Error');
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

//2-I can add a dish to the resturant
exports.createDish  = function (name) {
    db.query("CREATE (:Dish { dish_name:{np} })", params = {np:name}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}
exports.addDishToRestaurant  = function (dish,restaurant) {
    db.query("MATCH (d:Dish),(r:Restaurant) WHERE d.dish_name={dp} AND r.name ={rp} CREATE (r)-[rl:Has]->(d)", params = {dp:dish,rp:restaurant}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

var restaurants;
exports.getRestaurants = function(callback) {
    db.query("MATCH (r:Restaurant) RETURN r.name;", params = {}, function(err, results) {
        if (err){
            console.error('Error');
            throw err;
        }
        restaurants = results.map(function(result) {
            return result['r.name'];
        });
        restaurants = '{ \"myData\":' + JSON.stringify(restaurants) + ' }';
        restaurants = JSON.parse(restaurants);
        callback(restaurants);
    });
}