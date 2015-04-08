var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
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
    db.query("MATCH (n:User { email:{ep}}),(r:Restaurant { name:{rp}}) CREATE (n) -[:Review { title:{tp} , body:{bp} }]-> (r)"
        , params = {ep:UserEmail,rp:RestaurantName,tp:ReviewTitle,bp:ReviewBody}, function (err, results) {
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
}

    /*
	Sprint #-0-US-5
    Sprint #-1-US-28
	Sprint #-1-US-30
    Sprint #-1-US-33
	I can like a dish in a specific restaurant.
    The function takes an email and Dish name and match the user and the dish.
    Then it creates a Relation LIKES_DISH Relation between the user and a dish,
	the attribute likes which is a boolean value indicates whether a user likes or dislikes a dish,
	in this case the value is TRUE, therefore a like is created.
	the score attribute in the LIKES_DISH relation indicates the value that
	affects the overall score of the relationship between the users.
    
    Story 28:
    The function also creates another relation (LikeCuisine). 
    When a user likes a dish in a restaurant, this means he likes 
    the cuisine of this restaurant. So this function finds the restaurant containing this dish,
    then it finds the cuisines of this restaurant, and finally creates relation "LikeCuisine" 
    between the user and the these cuisines. It also adds a score of 5 points between the user

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
     	params = {ep:UserEmail,dnp:DishName}, function (err, results) {
        if (err) throw err;
        console.log('done');
    });
}

    /*
	Sprint #-0-US-7
	Sprint #-1-US-31
	I can dislike a dish in a specific restaurant.
    The function takes an email and Dish name and match the user and the dish.
    Then it creates a Relation LIKES_DISH Relation between the user and a dish,
	the attribute likes which is a boolean value indicates whether a user likes or dislikes a dish,
	in this case the value is FALSE, therefore a dislike is created.
	the score attribute in the LIKES_DISH relation indicates the value that
	affects the overall score of the relationship between the users.*/
exports.createrDisLikeUserDish  = function (UserEmail,DishName) {
     db.query("MATCH (u:User {email: {ep}}) , (d:Dish {dish_name: {dnp}}) merge (u)-[x:LIKES_DISH]->(d) set x.likes=FALSE set x.score=7 with u,d,x optional MATCH (u)-[:LIKES_DISH{likes:FALSE}]-> (d) <-[:LIKES_DISH{likes:FALSE}]-(y:User), (u)-[z:FOLLOWS]-(y) SET z.totalScore = z.totalScore + x.score return u,x,d,z", 
     	params = {ep:UserEmail,dnp:DishName}, function (err, results) {
        if (err) throw err;
        console.log('done');
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
        else console.log('Done');
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
        restaurants = JSON.stringify(restaurants);
        restaurants = JSON.parse(restaurants);
        callback(restaurants);
    });
}

exports.createDishAndRestaurant = function(dish, restaurant) {
    db.query("MATCH (r:Restaurant {name: {rp}}) CREATE (d:Dish {dish_name: {dp}}), (r)-[:HAS]->(d)", params = {dp:dish,rp:restaurant}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log('Done');
    });
}

/*  Sprint #-1-US-2
     The user can add a photo related to a specific restaurant.
     This function takes the User Email, Restaurant Name and the Photo URL as an input
     Then the node p of type Photo is created  and a relationship "addPhoto"  is created
     between the user and the photo. Another relationship "IN"
     shows that the photo is in this specific restaurant.
*/
exports.UserAddsPhotoToRestaurant = function (UserEmail,RestaurantName,photoURL) {
    db.query("MATCH (n:User { email:{ep} }),(r:Restaurant { name:{rp} }) CREATE (p:Photo { url : {url}}) CREATE (n) -[:addPhoto]->(p)-[:IN]->(r);",
        params = {ep:UserEmail,rp:RestaurantName,url:photoURL}, function (err, results) {
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
    db.query("MATCH (d:User),(r:User)  WHERE d.email={e1p} AND r.email = {e2p} AND d.email <> r.email   CREATE (d)-[f:FOLLOWS {score: 4, totalScore: 0}]->(r)", params = {e1p:FollowerEmail
            ,e2p:FolloweeEmail}
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
     The user can delete a photo yum in a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and deletes the relationship "ADD_YUM" between them.
*/
exports.UserDeletePhotoYum  = function (UserEmail, PhotoURL) {
    db.query("MATCH (n)-[rel:ADD_YUM]->(p:Photo) WHERE n.email={em} AND p.url={ur} DELETE rel", params = {em:UserEmail,ur:PhotoURL}, function (err, results) {
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


/*  Sprint #-1-US-9
     The user can share a photo on facebook or twitter.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and creates the relationship "SHARE_PHOTO" between them.
*/
exports.UserSharesPhoto  = function (UserEmail,PhotoURL) {
     db.query("MATCH (user:User {email: {ep}}), (photo:Photo {url: {url}}) CREATE (user)-[:SHARE_PHOTO {score:5}]->(photo)", 
        params = {ep:UserEmail,url:PhotoURL}, function (err, results) {
         if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });

}

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
            var ret = JSON.parse('{ ' + data1 + ' ,' + data2 + ' }');
            console.log(ret.RestaurantName[0]);
			callback(ret);
    });
}




//14-I can add a restaurant to favourites.
//The function takes as inputs the email of the user and the name of the restaurant
//and it gets the nodes of the restaurant and the user and creates a new relation called FAVORITES between the two nodes.
exports.createrFavouriteUserRestaurant  = function (email,RestaurantName) {
    db.query("MATCH (user:User {email: {ep}}), (rest:Restaurant {name: {rp}}) CREATE (user)-[:FAVORITES {score: 8}]->(rest);",params = {ep:email,rp:RestaurantName}, function (err, results) {
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
}

var relations;
exports.getRelations = function(callback) {
    db.query("MATCH ()-[r]->() return distinct type(r);", params = {}, function(err, results) {
        if (err){
            console.error('Error');
            throw err;
        }
        relations = results.map(function(result) {
            return result['type(r)'];
        });
        relations = JSON.stringify(relations);
        relations = JSON.parse(relations);
        callback(relations);
    });
}

var rel;
exports.Get_relation_info  = function (r, req, res) {
    var query = "match (u) -[:" + r + "]-> (m) return distinct labels(u) , labels(m)";
     db.query(query, function (err, results) {
         if (err){  console.log('Error');
                  throw err;
                 }
                
            data1 = results.map(function (result) {
             return result['labels(u)'];
            });
 
             data2 = results.map(function (result) {
             return result['labels(m)'];
             });
 
            data1 = ' \"Source\":' + JSON.stringify(data1);
             data2 = ' \"Destination\":' + JSON.stringify(data2);
             rel = JSON.parse('{ ' + data1 + ' ,' + data2 + ' }');
           indexjs.Get_relation_info_cont(req, res, rel);
     });
    
    
    return rel;
}


/*
    Sprint 1  US 21
        createCuisine(name):
    This function takes as input the Cuisine's
    name and creates the corresponding cuisine in the
    database.
*/
exports.createCuisine  = function (name) {
    db.query("CREATE (:Cuisine { name:{np} })", params = {np:name}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

/*
    Sprint 1  US 22
        createRelCuisineRestaurant(Restaurant name,Cuisine name):
    This function takes as input the Cuisine's
    name and restaurant's name and search for them in
    database then when they are found the function
    creates the corresponding relation between
    cuisine and restaurant in the database.
*/
exports.createRelCuisineRestaurant  = function (RestaurantName,CuisineName) {
    db.query("MATCH (c:Cuisine),(r:Restaurant) WHERE c.name={cp} AND r.name ={rp} CREATE (r)-[rl:HasCuisine]->(c)",
             params = {cp:CuisineName,rp:RestaurantName}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

/*
    Sprint 1  US 23
        createRelLikeCuisine(User Email,Cuisine name):
    This function takes as input the Cuisine's
    name and User's email and finds them in the database when
    they are found the function
    create a like relation between user and
    cuisine
*/
exports.createRelUserCuisine  = function (UserEmail,CuisineName) {
    db.query("MATCH (c:Cuisine),(u:User) WHERE c.Name={cp} AND u.email ={np} CREATE (u)-[rl:LikeCuisine{score:5}]->(c)",
             params = {cp:CuisineName,np:UserEmail}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

/*another method that make user like all cuisines of restaurant
    it finds the user and restaurant in the database then it gets
    all the cuisines of the restaurant and add a like cuisine relation
    between the user and the cuisines
*/

exports.createRelUserResCuisines  = function (UserEmail,RestaurantName) {
    db.query("MATCH (u:User),(r:Restaurant)-[HasCuisine]->(c:Cuisine) WHERE r.name={rp} AND u.email ={np} MERGE (u)-[rl:LikeCuisine{score:5}]->(c)",
             params = {rp:RestaurantName,np:UserEmail}, function (err, results) {
        if (err){  console.error('Error');
                 throw err;
                }
        else console.log("Done");
    });

}

