var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');
//(S3) I can sign up.
//The function takes the email of the user as an input.
//and it creates a new user.
exports.createUserQuery = "CREATE (n:User { email:{ep} })return n";
exports.createUser = function(email) {
    db.query(exports.createUserQuery, params = {
        ep: email
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else console.log("Done");
    });
}
//(S19) I can unfollow another user.
//This function takes two parameters :
//the follower email and the current user email
//then it matches the two users and deletes the relationship follow between them
exports.deleterFollowUserUserQuery = "MATCH (d)-[rel:FOLLOWS]->(r)  WHERE d.email={e1p} AND r.email={e2p}  DELETE rel";
exports.deleterFollowUserUser = function(FollowerEmail, FolloweeEmail) {
    db.query(exports.deleterFollowUserUserQuery, params = {
        e1p: FollowerEmail,
        e2p: FolloweeEmail
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
    });
}
//(S5) The function takes the following parameters:
//UserEmail, the restaurant name, the review title and the body of the review
//then it matches the user with the restaurant
//and adds the review to this restaurant
exports.createrReviewUserToRestaurantQuery = "MATCH (n:User { email:{ep}}),(r:Restaurant { name:{rp}}) CREATE (n) -[:Review { title:{tp} , body:{bp} }]-> (r)";
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
        } else console.log("Done");
    });
}

exports.createResturantQuery = "CREATE (:Restaurant { name:{np} })";
exports.createResturant = function(name) {
    db.query("CREATE (:Restaurant { name:{np} })", params = {
        np: name
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
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
exports.createrDisLikeUserDishQuery = "MATCH (u:User {email: {ep}}) , (d:Dish {dish_name: {dnp}}) merge (u)-[x:LIKES_DISH]->(d) set x.likes=FALSE set x.score=7 with u,d,x optional MATCH (u)-[:LIKES_DISH{likes:FALSE}]-> (d) <-[:LIKES_DISH{likes:FALSE}]-(y:User), (u)-[z:FOLLOWS]-(y) SET z.totalScore = z.totalScore + x.score return u,x,d,z";
exports.createrDisLikeUserDish = function(UserEmail, DishName) {
    db.query(exports.createrDisLikeUserDishQuery, params = {
        ep: UserEmail,
        dnp: DishName
    }, function(err, results) {
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
exports.createDishQuery = "CREATE (:Dish { dish_name:{np} })";
exports.createDish = function(name) {
    db.query(exports.createDishQuery, params = {
        np: name
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else console.log("Done");
    });
}

/*
    I can like a dish in a specific restaurant.
    The function takes an email and Dish name and match the user and the dish.
    Then it creates a Relation LIKES_DISH Relation between the user and a dish,
    the attribute likes which is a boolean value indicates whether a user likes or dislikes a dish,
    in this case the value is TRUE, therefore a like is created.
    the score attribute in the LIKES_DISH relation indicates the value that
    affects the overall score of the relationship between the users.
    */
exports.createrLikeUserDishQuery = "MATCH (u:User {email: {ep}}) , (d:Dish {dish_name: {dnp}}) merge (u)-[li:LIKES_DISH]->(d) set li.likes=TRUE set li.score=7 with u,d,li optional MATCH (u)-[:LIKES_DISH{likes:TRUE}]-> (d) <-[:LIKES_DISH{likes:TRUE}]-(y:User), (u)-[z:FOLLOWS]-(y) SET z.totalScore = z.totalScore + li.score return u limit 1";
exports.createrLikeUserDish = function(UserEmail, DishName) {
    db.query(exports.createrLikeUserDishQuery, params = {
        ep: UserEmail,
        dnp: DishName
    }, function(err, results) {
        if (err){ 
             throw err;
          }
        else{
            db.query("MATCH (u:User{email:{ep}}), (d:Dish {dish_name: {dnp}})<-[:HAS]-(r:Restaurant)-[:HasCuisine]->(c:Cuisine) MERGE (u)-[l:LikeCuisine{score:5}]->(c) WITH u, c, d, l Optional Match (u)-[f:FOLLOWS]-(uf:User)-[:LikeCuisine]->(c) set f.totalScore = f.totalScore + l.score", params = {
                ep: UserEmail,
                dnp: DishName
                }, function(err, results) {
                    if (err) { 
                        throw err;
                    }
                    else{
                        console.log('Done')
                    }
            });
        }
    });
}
/*  Sprint #-0-US-2
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

var restaurants;
exports.getRestaurants = function(callback) {
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
    });
}

/*  Sprint #-0-US-2
        createDishAndRestaurant(dish, restaurant):
        this function takes as input the dish's and
        restaurants name and creates the dish node,
        afterwards it creates the
        corresponding 'Has' relationship between this
        dish and this restaurant.
*/

exports.createDishAndRestaurantQuery = "MATCH (r:Restaurant {name: {rp}}) CREATE (d:Dish {dish_name: {dp}}), (r)-[:HAS]->(d)";
exports.createDishAndRestaurant = function(dish, restaurant) {
    db.query(exports.createDishAndRestaurantQuery, params = {
        dp: dish,
        rp: restaurant
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else console.log('Done');
    });
}
/*  Sprint #-1-US-2
     The user can add a photo related to a specific restaurant.
     This function takes the User Email, Restaurant Name and the Photo URL as an input
     Then the node p of type Photo is created  and a relationship "addPhoto"  is created
     between the user and the photo. Another relationship "IN"
     shows that the photo is in this specific restaurant.
*/
exports.UserAddsPhotoToRestaurantQuery = "MATCH (n:User { email:{ep} }),(r:Restaurant { name:{rp} }) CREATE (p:Photo { url : {url}}), (n) -[:addPhoto]->(p)-[:IN]->(r)";
exports.UserAddsPhotoToRestaurant = function(UserEmail, RestaurantName, photoURL) {
    db.query(exports.UserAddsPhotoToRestaurantQuery, params = {
        ep: UserEmail,
        rp: RestaurantName,
        url: photoURL
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else console.log("Done");
    });
}
/*  User Story 18
    Sprint # 0 us 18
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
exports.createFollowUserQuery = "MATCH (d:User),(r:User)  WHERE d.email={e1p} AND r.email = {e2p} AND d.email <> r.email   CREATE (d)-[f:FOLLOWS{ numberOfVisits :0 , totalScore :5}]->(r)";
exports.createFollowUser = function(FollowerEmail, FolloweeEmail) {
    db.query(exports.createFollowUserQuery, params = {
        e1p: FollowerEmail,
        e2p: FolloweeEmail
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
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
exports.visitFollowUser = function(FollowerEmail, FolloweeEmail) {
    db.query("MATCH (x) -[f:FOLLOWS]-> (y)  WHERE x.email={e1p} AND y.email = {e2p} AND x.email <> y.email SET f.numberOfVisits = f.numberOfVisits+1  SET f.totalScore = f.totalScore + 5", params = {
        e1p: FollowerEmail,
        e2p: FolloweeEmail
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
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
exports.UserAddPhotoYums = function(UserEmail, PhotoURL) {
    db.query("MATCH (user:User {email: {ep}}), (photo:Photo {url: {url}}) CREATE (user)-[:YUM_YUCK {value: TRUE, score: 3}]->(photo) WITH user,photo MATCH (user)-[x:YUM_YUCK {value: FALSE, score: 3}]->(photo) Delete x;", params = {
        ep: UserEmail,
        url: PhotoURL
    }, function(err, results) {
        if (err) {
            throw err;
        }
        console.log('done');
    });
}
/*  Sprint #-1-US-4
     The user can delete a photo yuck in a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and deletes the relationship "YUM_YUCK" with 'value: true' between them.
*/
exports.UserDeletePhotoYum = function(UserEmail, PhotoURL) {
    db.query("MATCH (n)-[rel:YUM_YUCK {value: TRUE}]->(p:Photo) WHERE n.email={em} AND p.url={ur} DELETE rel", params = {
        em: UserEmail,
        ur: PhotoURL
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
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
exports.UserAddPhotoYucks = function(UserEmail, PhotoURL) {
    db.query("MATCH (user:User {email: {ep}}), (photo:Photo {url: {url}}) CREATE (user)-[:YUM_YUCK {value: FALSE, score: 3}]->(photo) WITH user,photo MATCH (user)-[x:YUM_YUCK {value: TRUE, score: 3}]->(photo) Delete x;", params = {
        ep: UserEmail,
        url: PhotoURL
    }, function(err, results) {
        if (err){
            throw err;
        }
        console.log('done');
    });
}
/*  Sprint #-1-US-6
     The user can delete a photo yuck in a certain photo.
     This function takes the User Email and the Photo URL as an input.
     It matches the user and the photo and deletes the relationship "YUM_YUCK" with 'value: false' between them.
*/
exports.UserDeletePhotoYuck = function(UserEmail, PhotoURL) {
    db.query("MATCH (n)-[rel:YUM_YUCK {value:FALSE}]->(p:Photo) WHERE n.email={em} AND p.url={ur} DELETE rel", params = {
        em: UserEmail,
        ur: PhotoURL
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
exports.UserSharesRestaurantQuery = "MATCH (user:User {email: {ep}}), (restaurant:Restaurant {name: {rn}}) MERGE (user)-[:SHARE_RESTAURANT {score:5}]->(restaurant)";
exports.UserSharesRestaurant = function(UserEmail, RestaurantName) {
    db.query(exports.UserSharesRestaurantQuery, params = {
        ep: UserEmail,
        rn: RestaurantName
    }, function(err, results) {
        if (err) throw err;
        console.log('done');
    });
}

/*  Sprint #-1-US-8
     The user can share a dish on facebook or twitter.
     This function takes the User Email and the Dish Name as an input.
     It matches the user and the dish and creates the relationship "SHARE_DISH" between them.
*/
exports.UserSharesDish = function(UserEmail, DishName) {
    db.query("MATCH (user:User {email: {ep}}), (dish:Dish {dish_name: {dn}}) CREATE (user)-[:SHARE_DISH {score:5}]->(dish)", params = {
        ep: UserEmail,
        dn: DishName
    }, function(err, results) {
        if (err) throw err;
        console.log('done');
    });
}


/*  User Story 20
    Sprint #-1-US-9
    The user can share a photo on facebook or twitter.
    This function takes the User Email and the Photo URL as an input.
    It matches the user and the photo and creates the relationship "SHARE_PHOTO" between them.
*/
exports.UserSharesPhotoQuery="MATCH (user:User {email: {ep}}), (photo:Photo {url: {url}}) CREATE (user)-[:SHARE_PHOTO {score:5}]->(photo)";
exports.UserSharesPhoto = function(UserEmail, PhotoURL) {
    db.query(UserSharesPhotoQuery, params = {
        ep: UserEmail,
        url: PhotoURL
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
    });
}
/*  Sprint #-1-US-25
     The user can see posts on the news feed prioritized by the common photo yums 
     between that user and other users he's following.
     This function takes two inputs, the UserEmail and the UserEmailFollowed (the user followed).
     It matches the two users having yums on the same photos, and matches the users having a FOLLOWS relationship
     between them. I'll use the f to set the total score which is a property of the relation FOLLOWS.
     This allows the total Score between two users to be increased by 3 for each photo yum-ed by both users.
*/

exports.UserCommonYumsUser  = function (UserEmail, UserEmailFollowed) {
    db.query("MATCH (user1 {email:{ep1}})-[:YUM_YUCK {value: TRUE}]->(photo:Photo)<- [y:YUM_YUCK {value: TRUE}]-(user2 {email:{ep2}}),  (user1)-[f:FOLLOWS]-> (user2) set f.totalScore = f.totalScore+ y.score;", 
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
    db.query("MATCH (user1 {email:{ep1}})-[:YUM_YUCK {value: FALSE}]->(photo:Photo)<- [y:YUM_YUCK {value: FALSE}]-(user2 {email:{ep2}}),  (user1)-[f:FOLLOWS]-> (user2) set f.totalScore = f.totalScore+ y.score;", 
        params = {ep1:UserEmail, ep2:UserEmailFollowed}, function (err, results) {
        if (err){  
            console.log('Error');
            throw err;
        }
        else console.log("Done");
    });
}
var ret;
/*  Get_restaurant_info(name, req, res):
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
    db.query("match (R:Restaurant{name:{na}}) <-[out:Review]- () return out , R", params = {
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
        ret = JSON.parse('{ ' + data1 + ' ,' + data2 + ' }');
        callback(ret);
        console.log(ret.RestaurantName[0]);
    });
}
//14-I can add a restaurant to favourites.
//The function takes as inputs the email of the user and the name of the restaurant 
//and it gets the nodes of the restaurant and the user and creates a new relation called FAVORITES between the two nodes.
exports.createrFavouriteUserRestaurant = function(email, RestaurantName) {
    db.query("MATCH (user:User {email: {ep}}), (rest:Restaurant {name: {rp}}) CREATE (user)-[:FAVORITES]->(rest);", params = {
        ep: email,
        rp: RestaurantName
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
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
exports.commonFavoritedRestaurants = function(user1, user2) {
    db.query("MATCH (u1:User {email: {usr1}})-[:FAVORITES]->(r:Restaurant)<-[fav:FAVORITES]-(u2:User {email: {usr2}})," + "(u1)-[fol:FOLLOWS]->(u2) SET fol.totalScore = fol.totalScore + fav.score;", params = {
        usr1: user1,
        usr2: user2
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        } else console.log("Done");
    });
}
var relations;
exports.getRelations = function(callback) {
    db.query("MATCH (u)-[r]->(m) return distinct type(r);", params = {}, function(err, results) {
        if (err) {
            throw err;
        }
        relations = results.map(function(result) {
            return result['type(r)'];
        });
        callback(relations);
    });
}


var rel;
exports.changeRelationCost = function(name, cost) {
    db.query("MATCH (n)-[R:" + name + "]->(d) SET R.score = {c}", params = {
        c: cost
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
    });
}
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


var users;
exports.getUsers = function(callback) {
    db.query("MATCH (user:User) return distinct user.email;", params = {}, function(err, results) {
        if (err){
            console.error('Error');
            throw err;
        }
        users = results.map(function(result) {
            return result['user.email'];
        });
        users = JSON.stringify(users);
        users = JSON.parse(users);
        callback(users);
    });
}

var usr;
exports.Get_user_info  = function (r, req, res) {
    var query = "match (u:User {email: {mail}}) return u.email ", params = {mail:r};
     db.query(query, params, function (err, results) {
         if (err){  
            console.error('Error');
            throw err;
        }
                
            data1 = results.map(function (result) {
             return result['u.email'];
            });
            data1 = ' \"Source\":' + JSON.stringify(data1);
            usr = JSON.parse('{ ' + data1 + ' }');
           indexjs.Get_user_info_cont(req, res, usr);
     });
    
    
    return usr;
}


/*
    Sprint 1  US 21
        createCuisine(name):
    This function takes as input the Cuisine's
    name and creates the corresponding cuisine in the
    database.
*/
exports.createCuisine = function(name) {
    db.query("CREATE (:Cuisine { name:{np} })", params = {
        np: name
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else console.log("Done");
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
        } else console.log("Done");
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
exports.createRelUserCuisine = function(UserEmail, CuisineName) {
    db.query("MATCH (c:Cuisine),(u:User) WHERE c.Name={cp} AND u.email ={np} CREATE (u)-[rl:LikeCuisine{score:5}]->(c)", params = {
        cp: CuisineName,
        np: UserEmail
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else console.log("Done");
    });
}
/*
    createRelUserResCuisines(User email, Cuisine name):
    another method that make user like all cuisines of restaurant
    it finds the user and restaurant in the database then it gets
    all the cuisines of the restaurant and add a like cuisine relation
    between the user and the cuisines
*/
exports.createRelUserResCuisines = function(UserEmail, RestaurantName) {
    db.query("MATCH (u:User),(r:Restaurant)-[HasCuisine]->(c:Cuisine) WHERE r.name={rp} AND u.email ={np} MERGE (u)-[rl:LikeCuisine{score:5}]->(c)", params = {
        rp: RestaurantName,
        np: UserEmail
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else console.log("Done");
    });
}
/*
    In this portion of code we will increase the totalScore between two users. First given the two emails we will get the number of common followers
    and this will be set to the variable commonFollowers. A second Query will be called which calls gets the score of one follow and the calcualtes
    the new score. then a third query will edit the totalScore in the required follow relation.
*/
/*
    findCommonFollowers(User email, User email):
    This function takes two emails, checks whether the two users follow
    each other and then if they do it finds the Users followed by the User 
    arguments passed.
*/
// Must fix the callback hell problem for better performance
var commonFollowers;
exports.findCommonFollowers = function(firstUser, secondUser) {
    var relationScore;
    var totalScore;
    db.query("MATCH (a:User)-[:FOLLOWS]->(b:User) , (a)-[:FOLLOWS]->(c:User) , (b)-[:FOLLOWS]->(c) WHERE a.email={u1} and b.email={u2} return count(Distinct c) as total;", params = {
        u1: firstUser,
        u2: secondUser
    }, function(err, results) {
        if (err) {
            console.log('Error');
            throw err;
        }
        commonFollowers = results.map(function(result) {
            return result['total']
        });
        console.log("The number of common Followers between " + firstUser + " and " + secondUser + " is " + commonFollowers);
        console.log("The number of common Followers is " + commonFollowers);
        db.query("match (n)-[f:FOLLOWS]->(u) return Distinct f.score as score;", params = {}, function(err, results) {
            if (err) {
                console.log("couldnot get secure of follow relationship");
                throw err;
            }
            relationScore = results.map(function(result) {
                return result['score']
            });
            console.log("The value of following relation is " + relationScore);
            totalScore = commonFollowers * relationScore;
            //console.log(total);
            console.log(totalScore);
           // total = totalScore;
            db.query("MATCH (a:User)-[f:FOLLOWS]->(b:User) where a.email ={u1} and b.email ={u2} set f.totalScore ={value};", params = {
                u1: firstUser,
                u2: secondUser,
                value: totalScore
            }, function(err, results) {
                if (err) {
                    console.log("Error in setting new totalScore for follow relation");
                    throw err;
                } else {
                    console.log("The total should be " + totalScore);
                    console.log("Set new totalScore successfully");
                }
            });
        });
    });
}

exports.setFollowersScore = function(user1,user2) {
    db.query("MATCH (a:User)-[f:FOLLOWS]->(b:User) , (a)-[e:FOLLOWS]->(c:User) , (b)-[d:FOLLOWS]->(c) WHERE a.email= {u1} and b.email= {u2} WITH count(Distinct c)*f.score as total OPTIONAL MATCH (a1:User)-[f1:FOLLOWS]->(b1:User) WHERE a1.email= {u1} and b1.email= {u2} SET f1.totalScore = total",
        params = {u1:user1, u2:user2}, function (err,results) {
            if(err){
                console.log("error");
            } else {
                console.log("updated total score");
            }

        });
}

/*
User Story 13
SPRINT#0 US 15
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
            console.log("resturant removed form favourites successfully");
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
    });
}
/*  Sprint #-1-US-1
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
        } else console.log("Done");
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
    });
}

exports.getNewsfeed = function (email, callback) {
    db.query("MATCH (n:User)-[f:FOLLOWS]->(u:User) , (u)-[z]->(x) WHERE n.email = {email} return u.email,type(z),x order by f.totalScore DESC", 
        params = {
            email:email
        }, function(err, results) {
            if(err){
                console.log("error");
                throw err;
            }
            console.log("newsfeed fetched");

            var actions = results.map(function(result) {
                return JSON.parse('{ ' + '\"email\":' + JSON.stringify(result['u.email']) + ', \"rel\":' + JSON.stringify(result['type(z)']) 
                    + ', \"node\":' + JSON.stringify(result['x'].data) + ', \"label\":' + JSON.stringify(result['x']._data.metadata.labels) + ' }');
            });
            
            callback(actions);
        });
}

/*
Sprint2-S3
the query takes two params. the dish name and the user email to get similar ]
restaurants with the same cuisine that this dish's restaurant belongs to.
*/
exports.getCommonRestaurants = function(Dish, email){
    db.query("match (n:User{email:"
        + email "}), (c:Cuisine), (u:User) , (d:Dish{name:"+ Dish +"}),(di:Dish), (r:Restaurant)
          ,(re:Restaurant), (n)-[:FOLLOWS]->(u),(n)-[:LIKES_DISH]->(d),
           (d)<-[:HAS]-(r) , (r)-[:OfferedBy]->(c), (re)-[:OfferedBy]->(c), 
         (u)-[:LIKES_DISH]->(di), (re)-[:HAS]->(di)  WHERE re <> r  return re.name;",
         params ={},
         Function(err, results){
            if(err){
              console.log("error");
                throw err;
            }
             var ress = results.map(function(result) {
                return JSON.parse('{ ' + '\"name\":' + JSON.stringify(result['re.name']));
            });
            
            callback(ress);
         });
}