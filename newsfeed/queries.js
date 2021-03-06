var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');



/*
    User Story 31
    Sprint #0-US-3
    This functions takes a string which is au user's email and then
    creates a node of type user with the email specified.
    There is no validation for email duplicates because it is not the scope 
    of the recommender system.
*/

exports.createUserQuery = "CREATE (n:User { email:{ep} })return n";
exports.createUser = function(email) {
    db.query(exports.createUserQuery, params = {
        ep: email
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else{ 
            exports.linkUserToCuisines(email);
        }
    });
}
/*
    User Story 41
    Sprint #2-US-4
    linking a user to all cuisines in the database.
    The function takes the email of the user as an input.
    and it creates relation LIKECUISINE between this user and each cuisine in the database
     and setting the initial score to 0 between this user and all cuisines.
*/

exports.linkUserToCuisinesQuery = "MATCH (c:Cuisine) , (n:User { email:{ep}}) CREATE (n)-[k:LikeCuisine{score:0, timestamp: TIMESTAMP()}]->(c)";
exports.linkUserToCuisines = function(email) {
    db.query(exports.linkUserToCuisinesQuery, params = {
        ep: email
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        }
		console.log('done');
    });
}


/*
    User Story 19
    Sprint #0-US-12
    This function takes two parameters :
    the follower email and the current user email
    then it matches the two users and deletes the relationship follow between them
*/

exports.deleterFollowUserUserQuery = "MATCH (d)-[rel:FOLLOWS]->(r)  WHERE d.email={e1p} AND r.email={e2p}  DELETE rel";
exports.deleterFollowUserUser = function(FollowerEmail, FolloweeEmail) {
    db.query(exports.deleterFollowUserUserQuery, params = {
        e1p: FollowerEmail,
        e2p: FolloweeEmail
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
		console.log('done');
    });
}
/*
    User Story 3
    Sprint #0-US-4
    The function takes the following parameters:
    UserEmail, the restaurant name, the review title and the body of the review
    then it matches the user with the restaurant
    and adds the review to this restaurant
*/



exports.createrReviewUserToRestaurantQuery = "MATCH (n:User { email:{ep}}),(r:Restaurant { name:{rp}}) CREATE (n) -[:Review { title:{tp} , body:{bp}, timestamp: TIMESTAMP() }]-> (r)";
exports.createrReviewUserToRestaurant = function(UserEmail, RestaurantName, ReviewTitle, ReviewBody) {
    db.query(exports.createrReviewUserToRestaurantQuery, params = {
        ep: UserEmail,
        rp: RestaurantName,
        tp: ReviewTitle,
        bp: ReviewBody
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
		console.log('done');
    });
}

/*
    User Story 29
    Sprint #1-US-1
    This fucntion receives the resturant name and type of cuisine which is already in the database and 
    then it creates a node with this restuarant. when the resturant node is created a query to link
    resturant with the cuisine is called.
*/

exports.createResturantQuery = "CREATE (:Restaurant { name:{np} })";
exports.createResturant = function(name,cuisine) {
    db.query("CREATE (:Restaurant { name:{np} })", params = {
        np: name
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else{ 
            exports.linkRestaurantToCuisine(name,cuisine);
        }
    });
}
/*
    User Story 41
    Sprint #2-US-4
    when the resturant node is created a relation "HAS_CUISINE"
    is created between the resturant 
    linking a restaurant to a certain cuisine in the database.
    The function takes the name of the restaurant and the name of the cuisine as inputs.
    and it creates relation LINKEDTO between this restaurant and that cuisine.
*/

exports.linkRestaurantToCuisineQuery = "MATCH (r:Restaurant { name:{np} }) , (c:Cuisine { name:{cp} }) CREATE (r)-[:HAS_CUISINE]->(c)";
exports.linkRestaurantToCuisine = function(name,cuisine) {
    db.query(exports.linkRestaurantToCuisineQuery , params = {
        np: name,
        cp:cuisine
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
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
    affects the overall score of the relationship between the users.
*/

exports.createrDisLikeUserDishQuery = "MATCH (u:User {email: {ep}}) , (d:Dish {dish_name: {dnp}}) , (s:scores) "+
"merge (u)-[x:LIKES_DISH]->(d) set x.timestamp = TIMESTAMP() set x.likes=FALSE set x.score= s.likesDishScore with u,d,x optional "+
"MATCH (u)-[:LIKES_DISH{likes:FALSE}]-> (d) <-[:LIKES_DISH{likes:FALSE}]-(y:User), (u)-[z:FOLLOWS]-(y) "+
"SET z.totalScore = z.totalScore + x.score return u,x,d,z";
exports.createrDisLikeUserDish = function(UserEmail, DishName) {
    db.query(exports.createrDisLikeUserDishQuery, params = {
        ep: UserEmail,
        dnp: DishName
    }, function(err, results) {
        if (err) throw err;
		console.log("done");
    }
	
	);
}
/*  
    User Story 30
    Sprint #-0-US-2
    createDish(name):
    This function takes as input the dish's 
    name and creates the corresponding dish in the
    database using a CYPHER CREATE query.
*/

exports.createDishQuery = "CREATE (:Dish { dish_name:{np} })";
exports.createDish = function(name) {
    db.query(exports.createDishQuery, params = {
        np: name
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } 
		console.log('done');
    });
}
/*
    User Story 4
    Sprint #0-US-5
    I can like a dish in a specific restaurant.
    The function takes an email and Dish name and match the user and the dish.
    Then it creates a Relation LIKES_DISH Relation between the user and a dish,
    the attribute likes which is a boolean value indicates whether a user likes or dislikes a dish,
    in this case the value is TRUE, therefore a like is created.
    the score attribute in the LIKES_DISH relation indicates the value that
    affects the overall score of the relationship between the users.
*/

exports.createrLikeUserDishQuery = "MATCH (u:User {email: {ep}}) , (d:Dish {dish_name: {dnp}}) , (s:scores)  merge (u)-[li:LIKES_DISH]->(d) set li.timestamp = TIMESTAMP() set li.likes=TRUE set li.score=s.likesDishScore with u,d,li optional MATCH (u)-[:LIKES_DISH{likes:TRUE}]-> (d) <-[:LIKES_DISH{likes:TRUE}]-(y:User), (u)-[z:FOLLOWS]-(y) SET z.totalScore = z.totalScore + li.score";
exports.createrLikeUserDish = function(UserEmail, DishName) {
    db.query(exports.createrLikeUserDishQuery, params = {
        ep: UserEmail,
        dnp: DishName
    }, function(err, results) {
        if (err){ 
             throw err;
          }
        else{
            db.query("MATCH (u:User{email:{ep}}), (d:Dish {dish_name: {dnp}})<-[:HAS]-(r:Restaurant)-[:HasCuisine]->(c:Cuisine), (s:scores)  MERGE (u)-[l:LIKECUISINE{score:l.score + s.likesDishScore}]->(c) WITH u, c, d, l Optional Match (u)-[f:FOLLOWS]-(uf:User)-[:LIKECUISINE]->(c) set f.totalScore = f.totalScore + l.score", params = {
                ep: UserEmail,
                dnp: DishName
                }, function(err, results) {
                    if (err) { 
                        throw err;
                    }
					console.log('done');
            });
        }
    });
}
/*  
    User Story 30
    Sprint #-0-US-2
    addDishToRestaurant(dish, restaurant):
    this function takes as input the dishs and
    the restaurants name and creates the
    corresponding 'Has' relationship between this
    dish and this restaurant.
*/
exports.addDishToRestaurantQuery = "match (d:Dish{dish_name:{dp}}),(r:Restaurant{name:{rp}}) merge (r)-[:HAS]->(d)";
exports.addDishToRestaurant = function(dish, restaurant) {
    db.query(exports.addDishToRestaurantQuery, params = {
        dp: dish,
        rp: restaurant
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else console.log('Done');
    });
}


//  has no story in the backlog

exports.getRestaurants = function(callback) {
    var restaurants;
    db.query("MATCH (r:Restaurant) RETURN r.name;", params = {}, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        }
        restaurants = results.map(function(result) {
            return result['r.name'];
        });
        restaurants = JSON.stringify(restaurants);
        restaurants = JSON.parse(restaurants);
        callback(restaurants);
		console.log('done');
    });
}

/*  User Story 38
    Sprint #-1-US-2
    Sprint #-2-US-11
    The user can add a photo related to a specific restaurant.
    This function takes the User Email, Restaurant Name and the Photo URL as an input
    Then the node p of type Photo is created  and a relationship "addPhoto"  is created
    between the user and the photo. Another relationship "IN"
    shows that the photo is in this specific restaurant.
    This query calls another query after the callback whick increases the score between 
    the user and the cuisines of the restaurant by a value = addPhotoScore
    which is defined in the databse.
*/

exports.UserAddsPhotoToRestaurantQuery = "MATCH (n:User),(r:Restaurant),(s:scores),(r)-[:HAS_CUISINE]->(c:Cuisine)<-[t:LikeCuisine]-(n) "+
"where n.email = {ep} and r.name = {rp} set t.score = t.score + s.addPhotoScore "+
"CREATE (p:Photo { url : {url}}), (n)-[:addPhoto {timestamp: TIMESTAMP(), score: TIMESTAMP()*s.addPhotoScore}]->(p)-[:IN]->(r);";

exports.UserAddsPhotoToRestaurant = function(UserEmail, RestaurantName, photoURL) {
    db.query(exports.UserAddsPhotoToRestaurantQuery, params = {
        ep: UserEmail,
        rp: RestaurantName,
        url: photoURL
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } 
		console.log('done');
    });
}

/*  User Story 18
    Sprint #0-US-18
    createFollowUser(FollowerEmail, FolloweeEmail): This function takes as an input the email of 
    the user that is requesting to follow another user, and the email of the other user that is
    being requested to be followed, then checks that these two emails are not the same (a user
    cannot follow his/herself). Finally, it creates the corresponding FOLLOWS relationship between
    these two users. It also amends the commonFollowers, commonYumsYucks and commonFavouritedRestaurants number.
    It calculates the score due common followers and adds it to the score.
*/

exports.createFollowUserQuery = "MATCH (d:User),(r:User)  WHERE d.email={e1p} AND r.email = {e2p} AND d.email <> r.email   CREATE (d)-[f:FOLLOWS{ numberOfVisits :0 , totalScore :5 , commonFollowers :0, commonFavourites :0, commonYumYuck :0, timestamp: TIMESTAMP()}]->(r)";
exports.createFollowUser = function(FollowerEmail, FolloweeEmail) {
    db.query(exports.createFollowUserQuery, params = {
        e1p: FollowerEmail,
        e2p: FolloweeEmail
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else {
            exports.commonFavoritedRestaurants(FollowerEmail,FolloweeEmail);
            exports.UserCommonYumsUser(FollowerEmail,FolloweeEmail);
            exports.UserCommonYucksUser(FollowerEmail,FolloweeEmail);
            exports.findCommonFollowers(FollowerEmail,FolloweeEmail);
            exports.setFollowersScore(FollowerEmail,FolloweeEmail);
			console.log('done');
        }
    });
}

/*  User Story 35
    Sprint #-1-US-25
    The user can see posts on the news feed prioritized by the common photo yums 
    between that user and other users he's following.
    This function takes two inputs, the UserEmail and the UserEmailFollowed (the user followed).
    It matches the two users having yums on the same photos, and matches the users having a FOLLOWS relationship
    between them. I'll use the f to set the total score which is a property of the relation FOLLOWS.
    This allows the total Score between two users to be increased by 3 for each photo yum-ed by both users.
*/

var UserCommonYumsUserQuery = "MATCH (user1 {email:{ep1}})-[:YUM_YUCK {value: TRUE}]->(photo:Photo)<- [y:YUM_YUCK {value: TRUE}]-"+
                            "(user2 {email:{ep2}}),  (user1)-[f:FOLLOWS]-> (user2) set f.totalScore = f.totalScore+ y.score "+
                            "set f.commonYumYuck = f.commonYumYuck + 1;";

exports.UserCommonYumsUser  = function (UserEmail, UserEmailFollowed) {
    db.query(UserCommonYumsUserQuery, 
        params = {
            ep1:UserEmail, ep2:UserEmailFollowed
        }, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

/*  User Story 36
    Sprint #-1-US-26
    The user can see posts on the news feed prioritized by the common photo yucks 
    between that user and other users he's following.
    This function takes two inputs, the UserEmail and the UserEmailFollowed (the user followed).
    It matches the two users having yucks on the same photos, and matches the users having a FOLLOWS relationship
    between them. I'll use the f to set the total score which is a property of the relation FOLLOWS.
    This allows the total Score between two users to be increased by 3 for each photo yuck-ed by both users.
*/

var UserCommonYucksUserQuery = "MATCH (user1 {email:{ep1}})-[:YUM_YUCK {value: FALSE}]->(photo:Photo)"+
                            "<- [y:YUM_YUCK {value: FALSE}]-(user2 {email:{ep2}}),  (user1)-[f:FOLLOWS]-> (user2) "+
                            "set f.totalScore = f.totalScore+ y.score set f.commonYumYuck = f.commonYumYuck + 1;"
exports.UserCommonYucksUser  = function (UserEmail, UserEmailFollowed) {
    db.query(UserCommonYucksUserQuery, 
        params = {
            ep1:UserEmail, ep2:UserEmailFollowed
        }, function (err, results) {
        if (err){  
            console.log('Error');
            throw err;
        }
        else console.log("Done");
    });
}

/*  User Story
    Sprint #-1-US-20
    commonFavoritedRestaurants():
    This function takes as input 2 users. It matches these 2 users in the database
    if they are following each other and have favorited the same restaurant,
    and increases the corresponding totalScore between these two users
    (in the :FOLLOWS relationship), incrementing it by the score in the
    :FAVORITES relationship.
*/

var commonFavoritedRestaurantsQuery = "MATCH (u1:User)-[:FAVORITES]->(r:Restaurant)<-[fav:FAVORITES]-(u2:User),(u1)-[fol:FOLLOWS]->(u2) "+
                                        "where u1.email={usr1} and u2.email={usr2} set fol.commonFavourites = fol.commonFavourites + 1 "+
                                        "SET fol.totalScore = fol.totalScore + fav.score return u1,u2,fol;";
exports.commonFavoritedRestaurants = function(user1, user2) {
    db.query(commonFavoritedRestaurantsQuery, params = {
        usr1: user1,
        usr2: user2
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } 
		console.log('done');
    });
}



/*
    User Story 42
    Sprint #1-US-27
    Takes two emails and then finds the common followers between the two users with these emails
    then set the value of common followers to commonFollowes atitribute in the FOLLOWS relation.
*/

var findCommonFollowersQuery = "MATCH (a:User)-[:FOLLOWS]->(b:User) , (a)-[:FOLLOWS]->(c:User) , "+
                            "(b)-[:FOLLOWS]->(c) WHERE a.email={u1} and b.email={u2} with  count(Distinct c) as total "+
                            "Match (a)-[f:FOLLOWS]->(b) where a.email={u1} and b.email={u2} set f.commonFollowers = total";
exports.findCommonFollowers = function(firstUser, secondUser) {
    var relationScore;
    var commonFollowers;
    var totalScore;
    db.query(findCommonFollowersQuery, params = {
        u1: firstUser,
        u2: secondUser
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
		console.log('done');
    });
}

/*
    User Story 42
    Sprint  #1-US-27
    This query takes two emails and finds the common followers between the two users. 
    It then updates the score by using the common followers score in the FOLLOWS relation.
*/
var setFollowersScoreQuery = "MATCH (a:User)-[f:FOLLOWS]->(b:User) , (a)-[e:FOLLOWS]->(c:User) , "+
                        "(b)-[d:FOLLOWS]->(c) WHERE a.email= {u1} and b.email= {u2} WITH count(Distinct c)*f.score as total "+
                        "OPTIONAL MATCH (a1:User)-[f1:FOLLOWS]->(b1:User) WHERE a1.email= {u1} and b1.email= {u2} "+
                        "SET f1.totalScore = total"
exports.setFollowersScore = function(user1,user2) {
    db.query(setFollowersScoreQuery, params = {
            u1:user1,
            u2:user2
        }, function (err,results) {
            if(err){
                console.log("error");
            } 
			console.log('done');
    });
}


/*  
    This query is on hold till the database needed for testing is provided by the PO
    User Story
    Sprint #-1-US-29
    visitFollowUser(FollowerEmail,FolloweeEmail):
    This function takes as an input the email of the user who is already 
    logged in now which is "FollowerEmail" and the email of the user he 
    is following  "FolloweeEmail" and each time the follower visits the 
    followee's profile the numberOFVisits which is a property in
    the relation follow will be incrementedby one.This function is to 
    get the number of how many times a user visits another user's
    profile but there should be a relation follow between them.
*/

exports.visitFollowUserQuery = "MATCH (x) -[f:FOLLOWS]-> (y)  WHERE x.email={e1p} AND y.email = {e2p} AND x.email <> y.email "+
"SET f.numberOfVisits = f.numberOfVisits+1  SET f.totalScore = f.totalScore + 5";

exports.visitFollowUser = function(FollowerEmail, FolloweeEmail) {
    db.query(exports.visitFollowUserQuery, params = {
        e1p: FollowerEmail,
        e2p: FolloweeEmail
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
    });
}



/*   
	 User Story S8
	 Sprint #-1-US-3
     The user can add a photo yum to a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and creates the relationship "YUM_YUCK" to it.
     If this relationship has a value true, then a yum is added. If it's false, then it's a yuck.
     The property "score" determines the weight of the action of adding a photo yum. It's to be used while getting the common photo yums between 2 users.
     If there was a yuck on this photo, placed by the same user, then it will be deleted 
     and replaced by a yum.
*/
exports.UserAddPhotoYumsQuery = "MATCH (user:User {email: {ep}}), (photo:Photo {url: {url}}) ,(s:scores), (user)-[ts:LikeCuisine]-(c:Cuisine)<-[:HAS_CUISINE]-(r:Restaurant)<-[:IN]-(photo) "+
"set ts.score = ts.score+s.yum_yuckScore CREATE (user)-[:YUM_YUCK {value: TRUE, score:s.yum_yuckScore*TIMESTAMP(), timestamp: TIMESTAMP()}]->(photo) WITH user,photo "+
"MATCH (user)-[x:YUM_YUCK {value: FALSE}]->(photo) Delete x;";

exports.UserAddPhotoYums = function(UserEmail, PhotoURL) {
    db.query(exports.UserAddPhotoYumsQuery, params = {
        ep: UserEmail,
        url: PhotoURL
    }, function(err, results) {
        if (err) {
            throw err;
        }
    });
}
/*   
	 User Story S9
	 Sprint #-1-US-4
     The user can delete a photo yum in a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and deletes the relationship "YUM_YUCK" with 'value: true' between them.
*/
exports.UserDeletePhotoYumQuery = "MATCH (n)-[rel:YUM_YUCK {value: TRUE}]->(p:Photo) WHERE n.email={ep} AND p.url={ur} DELETE rel";
exports.UserDeletePhotoYum = function(UserEmail, PhotoURL) {
    db.query(exports.UserDeletePhotoYumQuery, params = {
        ep: UserEmail,
        ur: PhotoURL
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
    });
}
/*  
	 User Story S10
	 Sprint #-1-US-5
     The user can add a photo yuck to a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and creates the relationship "YUM_YUCK" to it.
     If this relationship has a value true, then a yum is added. If it's false, then it's a yuck.
     The property "score" determines the weight of the action of adding a photo yuck.
      It's to be used while getting the common photo yucks between 2 users.
     If there was a yum on this photo, placed by the same user, then it will be deleted 
     and replaced by a yuck.
*/
exports.UserAddPhotoYucksQuery = "MATCH (user:User {email: {ep}}), (photo:Photo {url: {url}}) , (s:scores) CREATE (user)-[:YUM_YUCK {value: FALSE, score: s.yum_yuckScore, timestamp: TIMESTAMP()}]->(photo) WITH user,photo,s MATCH (user)-[x:YUM_YUCK {value: TRUE, score: s.yum_yuckScore}]->(photo) Delete x;";
exports.UserAddPhotoYucksScore="MATCH (n:User { email:{ep} })-[ts:LIKECUISINE]-(c:Cuisine)<-[:HAS_CUISINE]-(r:Restaurant)<-[:IN]-(p:Photo{url: {url}}), (s:scores) set ts.score = ts.score-s.yum_yuckScore";
exports.UserAddPhotoYucks = function(UserEmail, PhotoURL) {
    db.query(exports.UserAddPhotoYucksQuery, params = {
     ep: UserEmail,
        url: PhotoURL
    }, function(err, results) {
        if (err) {
            throw err;
        }
       else{
                db.query(exports.UserAddPhotoYucksScore, params = {
                ep: UserEmail,
                url: PhotoURL
                }, function(err, results) {
                if (err) {
                    throw err;
                }
				console.log('done');
                });
        }
    });
}
/* 	 
	 User Story S11
	 Sprint #-1-US-6
     The user can delete a photo yuck in a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and deletes the relationship "YUM_YUCK" with 'value: false' between them.
*/
exports.UserDeletePhotoYuckQuery = "MATCH (n)-[rel:YUM_YUCK {value:FALSE}]->(p:Photo) WHERE n.email={ep} AND p.url={url} DELETE rel";
exports.UserDeletePhotoYuck = function(UserEmail, PhotoURL) {
    db.query(exports.UserDeletePhotoYuckQuery, params = {
        ep: UserEmail,
        url: PhotoURL
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
    });
}
/*  
    User Story 14 & 15
    Sprint #-1-US-7
    This Function takes as parameters user's email and restaurant's name.
    Then it matches the user by email and the restaurant by name. If found,
    it creates a relation between them called [SHARE_RESTAURANT] which has a score
    of 5 points that is to be added to the total score between users who follow
    each other and shared the same restaurant.
*/

exports.UserSharesRestaurantQuery = "MATCH (user:User {email: {ep}}), (restaurant:Restaurant {name: {rn}}) , (s:scores) MERGE (user)-[:SHARE_RESTAURANT {score:s.shareRestaurantScore, timestamp: TIMESTAMP()}]->(restaurant)";
exports.UserSharesRestaurant = function(UserEmail, RestaurantName) {
    db.query(exports.UserSharesRestaurantQuery, params = {
        ep: UserEmail,
        rn: RestaurantName
    }, function(err, results) {
        if (err) throw err;
        console.log('done');
    });
}


/*   
	 User Story S21
	 Sprint #-1-US-8

     The user can share a dish on facebook or twitter.
     This function takes the User Email and the Dish Name as an input.
     It matches the user and the dish and creates the relationship "SHARE_DISH" between them.
*/
exports.UserSharesDishQuery = "MATCH (user:User {email: {ep}}), (dish:Dish {dish_name: {dn}}) , (s:scores) CREATE (user)-[:SHARE_DISH {score:s.shareDishScore, timestamp: TIMESTAMP()}]->(dish)";
exports.UserSharesDish = function(UserEmail, DishName) {
    db.query(exports.UserSharesDishQuery, params = {
        ep: UserEmail,
        dn: DishName
    }, function(err, results) {
        if (err) throw err;
		console.log('done');
    });
}


/*  
	User Story 20
    Sprint #-1-US-9
    The user can share a photo on facebook or twitter.
    This function takes the User Email and the Photo URL as an input.
    It matches the user and the photo and creates the relationship "SHARE_PHOTO" between them.
*/

exports.UserSharesPhotoQuery="MATCH (user:User {email: {ep}}), (photo:Photo {url: {url}}) , (s:scores) CREATE (user)-[:SHARE_PHOTO {score:s.sharePhotoScore, timestamp: TIMESTAMP()}]->(photo)";
exports.UserSharesPhoto = function(UserEmail, PhotoURL) {
    db.query(UserSharesPhotoQuery, params = {
        ep: UserEmail,
        url: PhotoURL
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
		console.log('done');
    });
}

/*  
	Get_restaurant_info(name, req, res):

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
exports.Get_restaurant_info = function(name, callback) {
    db.query("match (R:Restaurant{name:{na}}) <-[out:REVIEW]- () return out , R", params = {
        na: name
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
        data1 = results.map(function(result) {
            return result['out'];
        });
        data2 = results.map(function(result) {
            return result['R'];
        });
        data1 = ' \"myData\":' + JSON.stringify(data1);
        data2 = ' \"RestaurantName\":' + JSON.stringify(data2);
        var ret = JSON.parse('{ ' + data1 + ' ,' + data2 + ' }');
        callback(ret);
        console.log(ret.RestaurantName[0]);
    });
}


//exports.createrFavouriteUserRestaurantScore = "match (s:Scores),(r:Restaurant { name:{rp} })-[:HasCuisine]->(c:Cuisine)<-[t:LIKECUISINE]-(n:User { email:{ep} }) set t.score = t.score + s.favouritesScore "
//exports.createrFavouriteUserRestaurantScore = "match (r:Restaurant { name:{rp} })-[:HasCuisine]->(c:Cuisine)<-[t:LIKECUISINE]-(n:User { email:{ep} }) set t.score = t.score + 10 return t.score"

/*
    Sprint #-2-US12 and
    Sprint #-1-US-9
    I can add a restaurant to favourites.
    The function takes as inputs the email of the user and the name of the restaurant 
    and it gets the nodes of the restaurant and the user and creates a new relation called 
    FAVORITES between the two nodes.
    In the callback of the 1st query, it calls another query which increases the score 
    between the user and the cuisines of the restaurant by value = favouritesScore
    which is defined in the database 
*/
exports.createrFavouriteUserRestaurantQuery = "MATCH (user:User {email: {ep}}), (rest:Restaurant {name: {rp}}),(s:scores),(rest)-[:HAS_CUISINE]->(c:Cuisine)<-[t:LikeCuisine]-(user) "+
"set t.score = t.score + s.favouritesScore CREATE (user)-[:FAVORITES {score: s.favouritesScore*TIMESTAMP(), timestamp: TIMESTAMP()}]->(rest) ;"
exports.createrFavouriteUserRestaurant = function(email, RestaurantName) {
    db.query(exports.createrFavouriteUserRestaurantQuery, params = {
        ep: email,
        rp: RestaurantName
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
    });
}



exports.getRelations = function(callback) {
    db.query("MATCH (u)-[r]->(m) return distinct type(r);", params = {}, function(err, results) {
        if (err) {
            throw err;
        }
        var relations = results.map(function(result) {
            return result['type(r)'];
        });
        callback(relations);
		console.log('done');
    });
}

exports.changeRelationCost = function(name, cost) {
    db.query("MATCH (n)-[R:'" + name + "']->(d) SET R.score = "+cost, params = {
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
		console.log('done');
    });
}


var rel;
exports.Get_relation_info = function(r, req, res) {
    var query = "match (u) -[:" + r + "]-> (m) return distinct labels(u) , labels(m)";
    db.query(query, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
        data1 = results.map(function(result) {
            return result['labels(u)'];
        });
        data2 = results.map(function(result) {
            return result['labels(m)'];
        });
        data1 = ' \"Source\":' + JSON.stringify(data1);
        data2 = ' \"Destination\":' + JSON.stringify(data2);
        rel = JSON.parse('{ ' + data1 + ' ,' + data2 + ' }');
        indexjs.Get_relation_info_cont(req, res, rel);
    });
    return rel;
}

exports.getUsers = function(callback) {
    db.query("MATCH (user:User) return distinct user.email;", params = {}, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        }
        var users = results.map(function(result) {
            return result['user.email'];
        });
        users = JSON.stringify(users);
        users = JSON.parse(users);
        callback(users);
		console.log('done');
    });
}
var usr;
exports.Get_user_info = function(r, req, res) {
    var query = "match (u:User {email: {mail}}) return u.email ",
        params = {
            mail: r
        };
    db.query(query, params, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        }
        data1 = results.map(function(result) {
            return result['u.email'];
        });
        data1 = ' \"Source\":' + JSON.stringify(data1);
        usr = JSON.parse('{ ' + data1 + ' }');
        indexjs.Get_user_info_cont(req, res, usr);
		console.log('done');
    });
    return usr;
}


/*	
	User Story S32
    Sprint #-1-US-21
    createCuisine(name):

    This function takes as input the Cuisine's
    name and creates the corresponding cuisine in the
    database.
*/
exports.createCuisineQuery = "CREATE (:Cuisine { name:{np} })";
exports.createCuisine = function(name) {
    db.query(exports.createCuisineQuery , params = {
        np: name
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            console.log("Done");
            exports.newAddedCuisineToUsers(name);
        }
    });
}
/*
	User Story S32
    Sprint #-2-US-4
    linking a newly added cuisine to all the users in the database.
    The function takes the name of the cuisine as an input.
    and it creates relation TOTALSCORE between this cuisine and each user in the database
    and setting the initial score to 0 between each user and this cuisine.
*/ 
exports.newAddedCuisineToUsersQuery = "MATCH (c:Cuisine{name:{np}}) , (n:User) CREATE (n)-[k:LIKECUISINE {timestamp:TIMESTAMP()}]->(c) set k.score=0";
exports.newAddedCuisineToUsers = function(cuisine) {
    db.query(exports.newAddedCuisineToUsersQuery, params = {
        np: cuisine
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else  console.log("Done");
    });
}

/*
    User Story 32
    Sprint #-1-US-22
    createRelCuisineRestaurant(Restaurant name,Cuisine name):
    This function takes as input the Cuisine's
    name and restaurant's name and search for them in
    database then when they are found the function
    creates the corresponding relation between
    cuisine and restaurant in the database.
*/
exports.createRelCuisineRestaurantQuery = "MATCH (c:Cuisine),(r:Restaurant) WHERE c.name={cp} AND r.name ={rp} CREATE (r)-[rl:HasCuisine]->(c)";
exports.createRelCuisineRestaurant = function(RestaurantName, CuisineName) {
    db.query(createRelCuisineRestaurantQuery, params = {
        cp: CuisineName,
        rp: RestaurantName
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        }
console.log('done');		
    });
}

/*
    User Story 37
    Sprint #-1-US-23
    createRelLIKECUISINE(User Email,Cuisine name):
    This function takes as input the Cuisine's 
    name and User's email and finds them in the database when
    they are found the function
    create a like relation between user and
    cuisine
*/
exports.createRelUserCuisine = function(UserEmail, CuisineName) {
    db.query("MATCH (c:Cuisine),(u:User),(g:scores) WHERE c.Name={cp} AND u.email ={np} CREATE (u)-[rl:LIKECUISINE]->(c) set rl.Score = g.likeCuisineScore", params = {
        cp: CuisineName,
        np: UserEmail
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        }
		console.log('done');
    });
}

/*
	User Story 37
    Sprint #-1-US-23
    createRelUserResCuisines(User email, Cuisine name):
    another method that make user like all cuisines of restaurant
    it finds the user and restaurant in the database then it gets
    all the cuisines of the restaurant and add a like cuisine relation
    between the user and the cuisines
*/
exports.createRelUserResCuisines = function(UserEmail, RestaurantName) {
    db.query("MATCH (s:scores), (r:Restaurant)-[HasCuisine]->(c:Cuisine)<-[l:LikeCuisine]-(u:User) WHERE r.name={rp} AND u.email ={np} set  l.score = l.score + s.favouritesScore", params = {
        rp: RestaurantName,
        np: UserEmail
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        }
		console.log('done');
    });
}
/*
	User Story 13
    Sprint #-0-US-15
	This function removes a specific restaurant from user's favourites
	It takes as parameters the email of the user and restaurant's name.
	It matches the user by email and the restaurant by name. Then it findes if the 
	user favourites this restaurant. If so, it removes the relation [:FAVORITES]
	from the database.
*/
exports.removeFavouriteResturantQuery = "MATCH (u:User)-[f:FAVORITES]->(r:Restaurant) where u.email = {e} and r.name = {r} DELETE f;";
exports.removeFavouriteResturant = function(email, resName) {
    db.query(exports.removeFavouriteResturantQuery, params = {
        e: email,
        r: resName
    }, function(err, results) {
        if (err) {
            console.log("Error removing resturant from favourites");
            throw err;
        } else {
            console.log('done');
        }
    });
}
exports.getUserFollowScore = function() {
    db.query("MATCH (n)-[f:FOLLOWS]->(u) return f.score;", params = {}, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        }
        relationScore = results.map(function(result) {
            return result['f.score']
        });
        newScore = relationScore * commonFollowers;
		console.log('done');
    });
}
/*   User Story S1
	 Sprint #-1-US-1
     The user can see his activity log.
     This function takes the User Email as an input.
     It matches the user with all other nodes that he has a relation with.
     then it returns all these nodes with the relations he has with them.
     
*/
exports.showOldActionsHistory = function(UserEmail) {
    db.query("MATCH (n:User)-[m]->(x) WHERE n.email={ep} RETURN n,m,x; ", params = {
        ep: UserEmail
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        }
		console.log('done');
    });
}

exports.checkUserExists = function(email, callback) {
    db.query("MATCH (n:User {email: {email}}) RETURN DISTINCT COUNT(n);", params = {
        email: email
    }, function(err, results) {
        if (err) {
            console.error("Error");
            throw err;
        }
        var count = results.map(function(result) {
            return result['COUNT(n)'];
        });
        callback(count[0]);
		console.log('done');
    });
}
exports.getNewsfeed = function(email, callback) {
    db.query("MATCH (n:User)-[f:FOLLOWS]->(u:User) , (u)-[z]->(x) WHERE n.email = {email} return u.email,type(z),x order by f.totalScore DESC", params = {
        email: email
    }, function(err, results) {
        if (err) {
            console.log("error");
            throw err;
        }
        var actions = results.map(function(result) {
            return JSON.parse('{ ' + '\"email\":' + JSON.stringify(result['u.email']) + ', \"rel\":' + JSON.stringify(result['type(z)']) + ', \"node\":' + JSON.stringify(result['x'].data) + ', \"label\":' + JSON.stringify(result['x']._data.metadata.labels) + ' }');
        });
        callback(actions);
		console.log('done');
    });
}
/*
Sprint2-S3
the query takes two params. the dish name and the user email to get similar ]
restaurants with the same cuisine that this dish's restaurant belongs to.
*/
exports.getCommonRestaurants = function(email, Dish) {
    var qu = "MATCH (n:User{email:'"+email+"'}), (u:User), (d:Dish{dish_name:'"+Dish
        + "'}), (c:Cuisine), (di:Dish), (r:Restaurant),(re:Restaurant), (n)-[:FOLLOWS]->(u),(n)-[:LIKES_DISH]->(d), (u)-[:LIKES_DISH]->(di), (d)<-[:Has]-(r), (di)<-[:Has]-(re), (re)-[:HasCuisine]->(c)<-[:HasCuisine]-(r) WHERE re <> r AND d <> di RETURN DISTINCT(re);"
    db.query(qu,params={}, function(err, results) {
        if (err) {
            throw err;
        }

        var ress = results.map(function(result) {
            return JSON.parse('{ ' + '\"name\":' + JSON.stringify(result['re.name']));
        });
        console.log('done');
        callback(ress);
    });
}
/*    Sprint#-2-US-5
    getLatestActionTime: gets the timestamp of the latest action that has been created by getting
    the maxiumum of all the created_at attributes and calls back this value.
*/
exports.getLatestActionTime = function (callback) {
    db.query("MATCH (:User)-[r]->() RETURN MAX(r.created_at);", function (err, results) {
        if (err)
        {
            console.error("Error");
            throw err;
        }
        var createdAt = results.map(function(result) {
            return result['MAX(r.created_at)'];
        });
        callback(createdAt);
		console.log('done');
    });
}
/*
    Sprint#-2-US-5
    createTimeDecay: takes as input the scale of decay to be able to customize the time decay factor;
    this decay specifies how fast the score should drop as it gets further from the latest action.
    The function gets the timestamp of the latest action by calling getLatestActionTime() and then
    does a check on the score, if it is not already multiplied by a time decay factor it does that,
    otherwise the score stays the same, since it is already mulitplied by a time decay factor. It
    does this for all kinds of actions/relations.
*/
exports.createTimeDecay = function (scale) {
    exports.getLatestActionTime(function(latest) {
        db.query("MATCH (a)-[r2:FAVORITES]->(b), (s:scores) SET r2.score = CASE r2.score WHEN s.favouritesScore THEN r2.score*EXP(-((ABS(TOINT(r2.created_at) - " + latest + ")/" + scale + "))) ELSE r2.score END", 
            function (err, results) {
            if (err)
            {
                console.error("Error");
                throw err;
            }
            console.log("Done");
        });
        db.query("MATCH (a)-[r2:LIKES_DISH]->(b), (s:scores) SET r2.score = CASE r2.score WHEN s.likesDishScore THEN r2.score*EXP(-((ABS(TOINT(r2.created_at) - " + latest + ")/" + scale + "))) ELSE r2.score END", 
            function (err, results) {
            if (err)
            {
                console.error("Error");
                throw err;
            }
            console.log("Done");
        });
        db.query("MATCH (a)-[r2:FOLLOWS]->(b), (s:scores) SET r2.score = CASE r2.score WHEN s.followsScore THEN r2.score*EXP(-((ABS(TOINT(r2.created_at) - " + latest + ")/" + scale + "))) ELSE r2.score END", 
            function (err, results) {
            if (err)
            {
                console.error("Error");
                throw err;
            }
            console.log("Done");
        });
        db.query("MATCH (a)-[r2:addPhoto]->(b), (s:scores) SET r2.score = CASE r2.score WHEN s.addPhotoScore THEN r2.score*EXP(-((ABS(TOINT(r2.created_at) - " + latest + ")/" + scale + "))) ELSE r2.score END", 
            function (err, results) {
            if (err)
            {
                console.error("Error");
                throw err;
            }
            console.log("Done");
        });
        db.query("MATCH (a)-[r2:LIKECUISINE]->(b), (s:scores) SET r2.score = CASE r2.score WHEN s.likeCuisineScore THEN r2.score*EXP(-((ABS(TOINT(r2.created_at) - " + latest + ")/" + scale + "))) ELSE r2.score END", 
            function (err, results) {
            if (err)
            {
                console.error("Error");
                throw err;
            }
            console.log("Done");
        });
        db.query("MATCH (a)-[r2:YUM_YUCK]->(b), (s:scores) SET r2.score = CASE r2.score WHEN s.yum_yuckScore THEN r2.score*EXP(-((ABS(TOINT(r2.created_at) - " + latest + ")/" + scale + "))) ELSE r2.score END", 
            function (err, results) {
            if (err)
            {
                console.error("Error");
                throw err;
            }
            console.log("Done");
        });
        db.query("MATCH (a)-[r2:SHARE_DISH]->(b), (s:scores) SET r2.score = CASE r2.score WHEN s.shareDishScore THEN r2.score*EXP(-((ABS(TOINT(r2.created_at) - " + latest + ")/" + scale + "))) ELSE r2.score END", 
            function (err, results) {
            if (err)
            {
                console.error("Error");
                throw err;
            }
            console.log("Done");
        });
        db.query("MATCH (a)-[r2:Review]->(b), (s:scores) SET r2.score = CASE r2.score WHEN s.reviewScore THEN r2.score*EXP(-((ABS(TOINT(r2.created_at) - " + latest + ")/" + scale + "))) ELSE r2.score END", 
            function (err, results) {
            if (err)
            {
                console.error("Error");
                throw err;
            }
            console.log("Done");
        });
        db.query("MATCH (a)-[r2:SHARE_PHOTO]->(b), (s:scores) SET r2.score = CASE r2.score WHEN s.sharePhotoScore THEN r2.score*EXP(-((ABS(TOINT(r2.created_at) - " + latest + ")/" + scale + "))) ELSE r2.score END", 
            function (err, results) {
            if (err)
            {
                console.error("Error");
                throw err;
            }
            console.log("Done");
        });
        db.query("MATCH (a)-[r2:SHARE_RESTAURANT]->(b), (s:scores) SET r2.score = CASE r2.score WHEN s.shareRestaurantScore THEN r2.score*EXP(-((ABS(TOINT(r2.created_at) - " + latest + ")/" + scale + "))) ELSE r2.score END", 
            function (err, results) {
            if (err)
            {
                console.error("Error");
                throw err;
            }
            console.log("Done");
        });
    });
}

/*
Sprint#2 Story 2:
The amount of time the user spends on a certain action done by another user 
will increase the score between the user and the cuisines.
The function takes three inputs: 
User1 Email (The user making an action) , 
User2 Email (The user viewing the action made by user 1),
TimeStamp (The amount of time user2 takes while viewing user1's action)
The query first matches user1 with all the cuisines he has a relation with and the node Scores
Then, it matches the relation LIKECUISINE between user2 and the same cuisines that user1 has a relation with 
and sets the score in LIKECUISINE (that is between user2 and the cuisines ) to score + (timeStamp * "a certain factor").
 In here I assumed that the factor will be 4, so it will multiply the given timeStamp by 4 and add it to the score in LIKECUISINE.
*/
exports.UserTimeUserQuery = "MATCH (user1 {email:{u1}})-[:LIKECUISINE]->(cui:Cuisine)  MATCH (user2 {email:{u2}}) -[li:LIKECUISINE]->(cui) set li.score = li.score + (toInt({ts})*4) ";
exports.UserTimeUser = function(UserEmail, UserViewingAction, TimeStamp) {
    db.query(exports.UserTimeUserQuery, params = {
        u1: UserEmail,
        u2: UserViewingAction,
        ts: TimeStamp
    }, function(err, results) {
        if (err) throw err;
        console.log('done');
    });
}

/* 
	Sprint #-2-US-6
    this function creates a new node which is a global one.
    it is used to change the values of all
    relations' scores.
    this node has a properties which are all the new values
    of the scores.
    it takes as an input the values of all scores
    then it sets the values.
    the values of the scores are then updates in other functions
    by setting the score to its corresponding one in the globalNode.   
*/

exports.createGlobalNodeQuery = "CREATE (s:scores { followsScore:{ep1} , reviewScore:{ep2} , likesDishScore:{ep3} ,"+
" addPhotoScore:{ep5} , yum_yuckScore:{ep6} , shareRestaurantScore:{ep7} ,"+
"shareDishScore:{ep8} , sharePhotoScore:{ep9} , favouritesScore:{ep10} , likeCuisineScore:{ep11}  })";
exports.createGlobalNode = function(followsScore , reviewScore , likesDishScore , addPhotoScore , yum_yuckScore , shareRestaurantScore , shareDishScore , sharePhotoScore , favouritesScore , likeCuisineScore) {
    db.query(exports.createGlobalNodeQuery, params = {
        ep1: followsScore ,
         ep2: reviewScore ,
          ep3: likesDishScore ,
           ep5:addPhotoScore ,
            ep6:yum_yuckScore ,
             ep7 :shareRestaurantScore ,
              ep8:shareDishScore ,
               ep9 :sharePhotoScore ,
               ep10:favouritesScore ,
                ep11:likeCuisineScore
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        }
    });
}

exports.NewsFeedDishes = function(user) {
    db.query('match (u:User{email:{up}}),(u2:User),(c:Cuisine),(d:Dish),(r:Restaurant),(s:scores)'
	+' with u,c,d,r,s'
	+' match (r)-[:HAS_CUISINE]->(c)<-[lc:LIKECUISINE]-(u)-[:FOLLOWS]->(u2)-[ld:LIKES_DISH]->(d)<-[:HAS]-(r)'
	+' return distinct u2.email as otherUser,type(ld) as relType, d.dish_name as dish, s.likesDishScore*ld.timestamp*lc.score as score', params = {
        up: user,
		currentimestamp: Date.now()
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			var dish = results.map(function(result) {
            return result['dish'];
			});
			var otherUser = results.map(function(result) {
            return result['otherUser'];
			});
			var relType = results.map(function(result) {
            return result['relType'];
			});
			var score = results.map(function(result) {
            return result['score'];
			});

			var data = [];
			for(var i=0; i<dish.length; i++)  {
			data[i] = {};              // creates a new object
			data[i].dish = dish[i];
			data[i].score = score[i];    
			data[i].user = otherUser[i];
			data[i].relType = relType[i]; 
			}
			exports.NewsFeedPhotos(user,data);
		}
    });
}


exports.NewsFeedPhotos = function(user,dish) {
    db.query('match (u:User{email:{up}}),(u2:User),(c:Cuisine),(p:Photo),(r:Restaurant),(s:scores)'
	+' with u,c,p,r,s'
	+' match (r)-[:HAS_CUISINE]->(c)<-[lc:LIKECUISINE]-(u)-[:FOLLOWS]->(u2)-[yy:YUM_YUCK]->(p)-[:IN]->(r)'
	+' return distinct u2.email as otherUser,type(yy) as relType, p.url as photo, s.yum_yuckScore*yy.timestamp*lc.score as score', params = {
        up: user,
		currentimestamp: Date.now()
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			var photo = results.map(function(result) {
            return result['photo'];
			});
			var score = results.map(function(result) {
            return result['score'];
			});
			var otherUser = results.map(function(result) {
            return result['otherUser'];
			});
			var relType = results.map(function(result) {
            return result['relType'];
			});
			
			var data = [];
			for(var i=0; i<photo.length; i++)  {
			data[i] = {};              // creates a new object
			data[i].photo = photo[i];
			data[i].score = score[i];    
			data[i].user = otherUser[i];
			data[i].relType = relType[i]; 
			}
			
			exports.NewsFeedRestaurants(user,dish,data);
		}
    });
}

exports.NewsFeedRestaurants = function(user,dish,photo) {
    db.query('match (u:User{email:{up}}),(u2:User),(c:Cuisine),(r:Restaurant),(s:scores)'
	+' with u2,u,c,r,s'
	+' match (r)-[:HAS_CUISINE]->(c)<-[lc:LIKECUISINE]-(u)-[:FOLLOWS]->(u2)-[f:FAVORITES]->(r)'
	+' return distinct u2.email as otherUser,type(f) as relType, r.name as restaurant, s.favouritesScore*f.timestamp*lc.score as score', params = {
        up: user,
		currentimestamp: Date.now()
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			var restaurant = results.map(function(result) {
            return result['restaurant'];
			});
			var score = results.map(function(result) {
            return result['score'];
			});
			var otherUser = results.map(function(result) {
            return result['otherUser'];
			});
			var relType = results.map(function(result) {
            return result['relType'];
			});
			
			
			var data = [];
			for(var i=0; i<restaurant.length; i++)  {
			data[i] = {};              // creates a new object
			data[i].restaurant = restaurant[i];
			data[i].score = score[i];  
			data[i].user = otherUser[i];
			data[i].relType = relType[i]; 			
			}
			
			var allData = [];
			var count=0;
			if(restaurant != null){
			for(var i = 0 ; i< restaurant.length; i++)  {
			allData[count] = {};              // creates a new object
			allData[count].element = data[i].restaurant;
			allData[count].score = data[i].score;    
			allData[count].user = data[i].user;
			allData[count].relType = data[i].relType; 	
			count++;
			}
			}
			if(dish != null){
			for(i = 0; i< dish.length; i++)  {
			allData[count] = {};              // creates a new object
			allData[count].element = dish[i].dish;
			allData[count].score = dish[i].score;    
			allData[count].user = dish[i].user;
			allData[count].relType = dish[i].relType; 	
			count++;			
			}
			}
			
			if(photo != null){
			for(i = 0; i< photo.length; i++)  {
			allData[count] = {};              // creates a new object
			allData[count].element = photo[i].photo;
			allData[count].score = photo[i].score;     
			allData[count].user = photo[i].user;
			allData[count].relType = photo[i].relType; 	
			count++;	
			}
			}
			function compare(a,b) {
				if (a.score < b.score)
					return 1;
				if (a.score > b.score)
					return -1;
				return 0;
			}
			allData = allData.sort(compare);
			for(var i = 0 ; i< allData.length; i++)  {
			console.log('---------------------');
			console.log('');
			console.log('Entity name\t:\t' + JSON.stringify(allData[i].element));
			console.log('User\t\t:\t' + JSON.stringify(allData[i].user));
			console.log('Relation name\t:\t' + JSON.stringify(allData[i].relType));
			console.log('Score Achieved\t:\t' + JSON.stringify(allData[i].score));
			console.log('');
			}
		}
    });
}
