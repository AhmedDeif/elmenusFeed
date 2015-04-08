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
<<<<<<< HEAD

    //(S6) I can like a dish in a specific restaurant.
    // The function takes an email and Dish name  and match the user and the dish.
    // Then it creates a Relation LIKED Relation between the user and a dish.
exports.createrLikeUserDish  = function (UserEmail,DishName) {
     db.query("MATCH (user:User {email: {ep}}), (dish:Dish {dish_name: {dnp}}) CREATE (user)-[:LIKES_DISH]->(dish) WITH user,dish MATCH (user)-[x:DISLIKES_DISH]->(dish) DELETE x", 
=======
}

 /*
	Story 33:
    When a user likes  dish in a restaurant, then a check is made to find
    if any of his followees like the same cuisine as that of this restaurant.
    If so, the score between the follower and the followee is increased by
    the score of common cuisine(Which is 5 in this case)* number of total 
    common cuisine likes. The relation is checked both ways to make sure that
    the score is added for each relation in case 2 users follow each other. 
    */
exports.createrLikeUserDish  = function (UserEmail,DishName) {
//match (n:User{email: 'kareem'}),(m:User{email: 'mohammed'}) merge (n) -[f:FOLLOWS]-> (m) set f.score = 20;
     db.query("MATCH (u:User {email: {ep}}) , (d:Dish {dish_name: {dnp}}) OPTIONAL MATCH (c:Cuisine)<-[:HasCuisine]-(r:Restaurant)-[:HAS]->(d) MERGE (u)-[:LikeCuisine{score:5}]->(c) with u, c, d OPTIONAL MATCH (u)-[l:LikeCuisine]->(c)<-[:LikeCuisine]-(yc:User) OPTIONAL MATCH (u)-[z1:FOLLOWS]->(yc) OPTIONAL MATCH (u)<-[z2:FOLLOWS]-(yc) SET z1.totalScore = z1.totalScore + l.score SET z2.totalScore = z2.totalScore + l.score merge (u)-[x:LIKES_DISH]->(d) set x.likes=TRUE set x.score=7 with u,d,x optional MATCH (u)-[:LIKES_DISH{likes:TRUE}]-> (d) <-[:LIKES_DISH{likes:TRUE}]-(y:User), (u)-[z:FOLLOWS]-(y) SET z.totalScore = z.totalScore + x.score return u,x,d,z", 
>>>>>>> master
     	params = {ep:UserEmail,dnp:DishName}, function (err, results) {
        if (err) throw err;
        console.log('done');
    });
}

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
<<<<<<< HEAD
    db.query("MATCH (d:User),(r:User)  WHERE d.email={e1p} AND r.email = {e2p} AND d.email <> r.email   CREATE (d)-[f:FOLLOWS]->(r)", params = {e1p:FollowerEmail
            ,e2p:FolloweeEmail}
            , function (err, results) {
        if (err){  console.log('Error');
=======
    db.query("MATCH (d:User),(r:User)  WHERE d.email={e1p} AND r.email = {e2p} AND d.email <> r.email   CREATE (d)-[f:FOLLOWS{ numberOfVisits :0 , totalScore :5}]->(r)", params = {e1p:FollowerEmail
            ,e2p:FolloweeEmail}
            , function (err, results) {
        if (err){  console.log('Error');

                 throw err;
                }
        else console.log("Done");
    });
}

/* Sprint #-1-US-29
    visitFollowUser(FollowerEmail,FolloweeEmail):
    This function takes as an input the email of 
    the user who is already logged in now which is
    "FollowerEmail" and the email of the user he 
    is following  "FolloweeEmail" and each time 
    the follower visits the followee's profile
    the numberOFVisits which is a property in
    the relation follow will be incremented
    by one.
    This function is to get the number of
    how many times a user visits another user's
    profile but there should be a relation follow
    between them.
    */
exports.visitFollowUser = function (FollowerEmail,FolloweeEmail) {
    db.query("MATCH (x) -[f:FOLLOWS]-> (y)  WHERE x.email={e1p} AND y.email = {e2p} AND x.email <> y.email SET f.numberOfVisits = f.numberOfVisits+1  SET f.totalScore = f.totalScore + 5",
     params = {e1p:FollowerEmail,e2p:FolloweeEmail}
            , function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

/*  Sprint #-1-US-3
     The user can add a photo yum to a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and creates the relationship "YUM_YUCK" to it.
     If this relationship has a value true, then a yum is added. If it's false, then it's a yuck.
     The property "score" determines the weight of the action of adding a photo yum. It's to be used while getting the common photo yums between 2 users.
     If there was a yuck on this photo, placed by the same user, then it will be deleted 
     and replaced by a yum.
*/
exports.UserAddPhotoYums  = function (UserEmail,PhotoURL) {
     db.query("MATCH (user:User {email: {ep}}), (photo:Photo {url: {url}}) CREATE (user)-[:YUM_YUCK {value: TRUE, score: 3}]->(photo) WITH user,photo MATCH (user)-[x:YUM_YUCK {value: FALSE, score: 3}]->(photo) Delete x;", 
        params = {ep:UserEmail,url:PhotoURL}, function (err, results) {
        if (err) throw err;
        console.log('done');
    });
}

/*  Sprint #-1-US-4
     The user can delete a photo yuck in a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and deletes the relationship "YUM_YUCK" with 'value: true' between them.
*/
exports.UserDeletePhotoYum  = function (UserEmail, PhotoURL) {
    db.query("MATCH (n)-[rel:YUM_YUCK {value: TRUE}]->(p:Photo) WHERE n.email={em} AND p.url={ur} DELETE rel", params = {em:UserEmail,ur:PhotoURL}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

/*  Sprint #-1-US-5
     The user can add a photo yuck to a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and creates the relationship "YUM_YUCK" to it.
     If this relationship has a value true, then a yum is added. If it's false, then it's a yuck.
     The property "score" determines the weight of the action of adding a photo yuck. It's to be used while getting the common photo yucks between 2 users.
     If there was a yum on this photo, placed by the same user, then it will be deleted 
     and replaced by a yuck.
*/

exports.UserAddPhotoYucks  = function (UserEmail,PhotoURL) {
     db.query("MATCH (user:User {email: {ep}}), (photo:Photo {url: {url}}) CREATE (user)-[:YUM_YUCK {value: FALSE, score: 3}]->(photo) WITH user,photo MATCH (user)-[x:YUM_YUCK {value: TRUE, score: 3}]->(photo) Delete x;", 
        params = {ep:UserEmail,url:PhotoURL}, function (err, results) {
        if (err) throw err;
        console.log('done');
    });
}


/*  Sprint #-1-US-6
     The user can delete a photo yuck in a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and deletes the relationship "YUM_YUCK" with 'value: false' between them.
*/
exports.UserDeletePhotoYuck  = function (UserEmail, PhotoURL) {
    db.query("MATCH (n)-[rel:YUM_YUCK {value:FALSE}]->(p:Photo) WHERE n.email={em} AND p.url={ur} DELETE rel", params = {em:UserEmail,ur:PhotoURL}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}


/*  Sprint #-1-US-7
     The user can share a restaurant on facebook or twitter.
     This function takes the User Email and the Restaurant Name as an input.
     It matches the user and the restaurant and creates the relationship "SHARE_RESTAURANT" between them.
*/
exports.UserSharesRestaurant  = function (UserEmail,RestaurantName) {

     db.query("MATCH (user:User {email: {ep}}), (restaurant:Restaurant {name: {rn}}) CREATE (user)-[:SHARE_RESTAURANT {score:5}]->(restaurant)", 
        params = {ep:UserEmail,rn:RestaurantName}, function (err, results) {
        if (err) throw err;
        console.log('done');
    });
}

/*  Sprint #-1-US-8
     The user can share a dish on facebook or twitter.
     This function takes the User Email and the Dish Name as an input.
     It matches the user and the dish and creates the relationship "SHARE_DISH" between them.
*/
exports.UserSharesDish = function (UserEmail,DishName) {
     db.query("MATCH (user:User {email: {ep}}), (dish:Dish {dish_name: {dn}}) CREATE (user)-[:SHARE_DISH {score:5}]->(dish)", 
        params = {ep:UserEmail,dn:DishName}, function (err, results) {
        if (err) throw err;
        console.log('done');
    });
}
>>>>>>> master

                 throw err;
                }
        else console.log("Done");
    });

}

<<<<<<< HEAD
var ret;
exports.Get_restaurant_info  = function (name) {
=======
/*  Sprint #-1-US-25
     The user can see posts on the news feed prioritized by the common photo yums 
     between that user and other users he's following.
     This function takes two inputs, the UserEmail and the UserEmailFollowed (the user followed).
     It matches the two users having yums on the same photos, and matches the users having a FOLLOWS relationship
     between them. I'll use the f to set the total score which is a property of the relation FOLLOWS.
     This allows the total Score between two users to be increased by 3 for each photo yum-ed by both users.
*/
exports.UserCommonYumsUser  = function (UserEmail, UserEmailFollowed) {
    db.query("MATCH (user1 {email:{ep1}})-[:YUM_YUCK {value: TRUE}]->(photo:Photo)<- [:YUM_YUCK {value: TRUE}]-(user2 {email:{ep2}}),  (user1)-[f:FOLLOWS]-> (user2) set f.score = f.score+3;", 
        params = {ep1:UserEmail, ep2:UserEmailFollowed}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}



/*  Sprint #-1-US-26
     The user can see posts on the news feed prioritized by the common photo yucks 
     between that user and other users he's following.
     This function takes two inputs, the UserEmail and the UserEmailFollowed (the user followed).
     It matches the two users having yucks on the same photos, and matches the users having a FOLLOWS relationship
     between them. I'll use the f to set the total score which is a property of the relation FOLLOWS.
     This allows the total Score between two users to be increased by 3 for each photo yuck-ed by both users.
*/
exports.UserCommonYucksUser  = function (UserEmail, UserEmailFollowed) {
    db.query("MATCH (user1 {email:{ep1}})-[:YUM_YUCK {value: FALSE}]->(photo:Photo)<- [:YUM_YUCK {value: FALSE}]-(user2 {email:{ep2}}),  (user1)-[f:FOLLOWS]-> (user2) set f.score = f.score+3;", 
        params = {ep1:UserEmail, ep2:UserEmailFollowed}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}



var ret;
/*	Get_restaurant_info(name, req, res):
    This function takes as an input the name of 
    the restaurant that the user is requesting
	then the reviews are fetched from the database.
	the(req, res) parameters are passed from index.js
	in order to be able to call the render function whenever
	the query finishes and fetches the results.
	the Get_restaurant_info_cont passes all these params to 
	index.js and then executes render passing the page name and the 
	output JSON object.
*/
exports.Get_restaurant_info  = function (name, callback) {
>>>>>>> master
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
<<<<<<< HEAD

=======
}


/*  Sprint #-1-US-7
     The user can share a restaurant on facebook or twitter.
     This function takes the User Email and the Restaurant Name as an input.
     It matches the user and the restaurant and creates the relationship "SHARE_RESTAURANT" between them.
*/
exports.UserSharesRestaurant  = function (UserEmail,RestaurantName) {
     db.query("MATCH (user:User {email: {ep}}), (restaurant:Restaurant {name: {rn}}) CREATE (user)-[:SHARE_RESTAURANT {score:5}]->(restaurant)", 
        params = {ep:UserEmail,rn:RestaurantName}, function (err, results) {
        if (err) throw err;
        console.log('done');
    });
}

/*  Sprint #-1-US-8
     The user can share a dish on facebook or twitter.
     This function takes the User Email and the Dish Name as an input.
     It matches the user and the dish and creates the relationship "SHARE_DISH" between them.
*/
exports.UserSharesDish = function (UserEmail,DishName) {
     db.query("MATCH (user:User {email: {ep}}), (dish:Dish {dish_name: {dn}}) CREATE (user)-[:SHARE_DISH {score:5}]->(dish)", 
        params = {ep:UserEmail,dn:DishName}, function (err, results) {
         if (err){  console.log('Error');
                          throw err;
                }
        else console.log("Done");
    });
}

/*
  Sprint #-1-US-20
    commonFavoritedRestaurants():
      This function takes as input 2 users. It matches these 2 users in the database
      if they are following each other and have favorited the same restaurant,
      and increases the corresponding totalScore between these two users
      (in the :FOLLOWS relationship), incrementing it by the score in the
      :FAVORITES relationship.
*/
exports.commonFavoritedRestaurants = function (user1, user2) {
  db.query("MATCH (u1:User {email: {usr1}})-[:FAVORITES]->(r:Restaurant)<-[fav:FAVORITES]-(u2:User {email: {usr2}}),"
  + "(u1)-[fol:FOLLOWS]->(u2) SET fol.totalScore = fol.totalScore + fav.score;", params = {usr1:user1, usr2:user2},
  function (err, results) {
    if (err)
    {
      console.log('Error');
      throw err;
    }
    else console.log("Done");
  });
>>>>>>> master
}
var relations;
exports.getRelations = function(callback) {
    db.query("MATCH (u)-[r]->(m) return distinct type(r);",
     params = {}, function(err, results) {
        if (err){
            throw err;
        }
        relations = results.map(function(result) {
            return result['type(r)'];
        });
		callback(relations);
    });
}

exports.changeRelationCost = function (name, cost) {
    db.query("MATCH (n)-[R:nam]->(d) SET R.cost = {c} return R;",
     params={nam:name, c:cost}, function(err,results){
       if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}
<<<<<<< HEAD

=======
>>>>>>> master
