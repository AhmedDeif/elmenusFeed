var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');


//(S3) I can sign up.
//The function takes the email of the user as an input.
//and it creates a new user.
exports.createUser  = function (email) {
    db.query("CREATE (n:User { email:{ep} })return n", params = {ep:email}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
});
}

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
    db.query("MATCH (n:User { email:{ep}}),(r:Restaurant { name:{rp}}) CREATE (n) -[:Review { title:{tp} , body:{bp} }]-> (r)", params = {ep:UserEmail,rp:RestaurantName,tp:ReviewTitle,bp:ReviewBody}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}
exports.createResturant  = function (name) {
    db.query("CREATE (:Restaurant { name:{np} })",
     params = {np:name}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });

    //(S6) I can like a dish in a specific restaurant.
    // The function takes an email and Dish name  and match the user and the dish.
    // Then it creates a Relation LIKED Relation between the user and a dish.
exports.createrLikeUserDish  = function (UserEmail,DishName) {
     db.query("MATCH (user:User {email: {ep}}), (dish:Dish {dish_name: {dnp}}) CREATE (user)-[:LIKES_DISH]->(dish) WITH user,dish MATCH (user)-[x:DILIKES_DISH]->(dish) DELETE x", 
     	params = {ep:UserEmail,dnp:DishName}, function (err, results) {
        if (err) throw err;
        console.log('done');
    });

}



//2-I can add a dish to the resturant
exports.createDish  = function (name) {
    db.query("CREATE (:Dish { dish_name:{np} })",
     params = {np:name}, function (err, results) {
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
    db.query("MATCH (d:Dish),(r:Restaurant) WHERE d.dish_name={dp} AND r.name ={rp} CREATE (r)-[rl:HAS]->(d)", params = {dp:dish,rp:restaurant}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}
};

/*  Sprint #-1-US-2
     The user can add a photo related to a specific restaurant.
     This function takes the User Email, Restaurant Name and the Photo URL as an input
     Then the node p of type Photo is created  and a relationship "addPhoto"  is created
     between the user and the photo. Another relationship "IN" 
     shows that the photo is in this specific restaurant.
*/
exports.UserAddsPhotoToRestaurant = function (UserEmail,RestaurantName,photoURL) {
    db.query("MATCH (n:User { email:{ep} }),(r:Restaurant { name:{rp} }) CREATE (p:Photo { url : {url}}) CREATE (n) -[:addPhoto]->(p)-[:IN]->(r);", params = {ep:UserEmail,rp:RestaurantName,url:photoURL}, function (err, results) {

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
    db.query("MATCH (d:User),(r:User)  WHERE d.email={e1p} AND r.email = {e2p} AND d.email <> r.email   CREATE (d)-[f:FOLLOWS]->(r)", params = {e1p:FollowerEmail
            ,e2p:FolloweeEmail}
            , function (err, results) {
        if (err){  console.log('Error');

                 throw err;
                }
        else console.log("Done");
    });

}

var ret;
exports.Get_restaurant_info  = function (name) {
    db.query("match (R:Restaurant{name:{na}}) <-[out:Review]- () return out , R", params = {na:name}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
				
			data1 = results.map(function (result) {
            return result['out'];
			});

            data2 = results.map(function (result) {
            return result['R'];
            });

			data1 = ' \"myData\":' + JSON.stringify(data1);
            data2 = ' \"RestaurantName\":' + JSON.stringify(data2);
            ret = JSON.parse('{ ' + data1 + ' ,' + data2 + ' }');
            console.log(ret.RestaurantName[0]);
    });
	
	return ret;
}




//14-I can add a restaurant to favourites.
//The function takes as inputs the email of the user and the name of the restaurant 
//and it gets the nodes of the restaurant and the user and creates a new relation called FAVORITES between the two nodes.
exports.createrFavouriteUserRestaurant  = function (email,RestaurantName) {
    db.query("MATCH (user:User {email: {ep}}), (rest:Restaurant {name: {rp}}) CREATE (user)-[:FAVORITES]->(rest);",params = {ep:email,rp:RestaurantName}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });

}
