var should = require('should');
var assert = require('assert');
var queries = require('./queries.js');
var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');


//(S3) I can sign up.
//The function takes the email of the user as an input.
//and it creates a new user.
/*
    Sprint 2  US 4
    linking a user to all cuisines in the database.
    The function takes the email of the user as an input.
    and it creates relation TOTALSCORE between this user and each cuisine in the database
     and setting the initial score to 0 between this user and all cuisines.
*/
describe('I can sign up', function () {
 it('Should add a user to the database and connect it to all the available cuisines in the database', function (done) {
     initialize();
     function initialize(){
       db.query('match n optional match ()-[y]-() delete n,y', params = {
                np:'Sushi'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			db.query('CREATE (:Cuisine { name:{np} })', params = {
                np:'Sushi'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            db.query('CREATE (s:Scores { followsScore:5, reviewScore:3 , likesDishScore:7 ,hasCuisineScore:6 , addPhotoScore:6 , yum_yuckScore:3 , shareRestaurantScore:2 ,shareDishScore:2 , sharePhotoScore:2 , favouritesScore:8 , likeCuisineScore:3  })', params = {
			}, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
        }
    });
        }
    });
    }
   function test(){
        db.query(queries.createUserQuery, params = {
        ep: 'kareemAdel@mail.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
    });
   }
    function verify(){
        db.query('OPTIONAL MATCH (u:User {name: {ep}})-[rel:TOTALSCORE]->(c:Cuisine) RETURN rel;', params = {
        ep: 'kareemAdel@mail.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var relationship = results.map(function(result) {
                    return result['rel'];
            });
            should.exist(relationship);
            done();
        }
    });
    }
 });
});

//(S19) I can unfollow another user.
//This function takes two parameters :
//the follower email and the current user email
//then it matches the two users and deletes the relationship follow between them
describe('I can unfollow another user', function () {
 it('the user should unfollow another user', function (done) {
     initialize();
     function initialize(){
        db.query('create (:User{name:{ep1}}),(:User{name:{ep2}})', params = {
        ep1: 'kareemAdel1@mail.com',
        ep2: 'kareemAdel2@mail.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
    }
    function test(){
   db.query(queries.deleterFollowUserUserQuery, params = {
        e1p: 'kareemAdel1@mail.com',
        e2p: 'kareemAdel2@mail.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
    });
    }
    function verify(){
        db.query('optional match (:User {name:{e1p}})-[rel:FOLLOWS]->(:User {name:{e2p}}) return rel', params = {
        e1p: 'kareemAdel1@mail.com',
        e2p: 'kareemAdel2@mail.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var res = results.map(function(result) {return result['rel'];});
            should.not.exist(res[0]);
            done();
        }
    });
    }
 });
});

//(S5) The function takes the following parameters:
//UserEmail, the restaurant name, the review title and the body of the review
//then it matches the user with the restaurant
//and adds the review to this restaurant
describe('I can create Review on a Restaurant', function () {
 it('A review should be added to the Restaurant', function (done) {
     initialize();
     function initialize(){
        db.query('create(:User{email:{ep}}),(:Restaurant{name:{rp}})', params = {
        ep: 'kareemAdel3@mail.com',
        rp: 'Spectra'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
    }
     function test(){
        db.query(queries.createrReviewUserToRestaurantQuery, params = {
        ep: 'kareemAdel3@mail.com',
        rp: 'Spectra',
        tp: 'myTitle',
        bp: 'myBody'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
     });}
    function verify(){
        db.query('optional MATCH (n:User { email:{ep}}),(r:Restaurant { name:{rp}}), (n) -[Rev:Review { title:{tp} , body:{bp} }]-> (r) return Rev', params = {
        ep: 'kareemAdel3@mail.com',
        rp: 'Spectra',
        tp: 'myTitle',
        bp: 'myBody'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var Rev = results.map(function(result) {return result['Rev'];});
            should.exist(Rev[0]);
            done();
        }
    });
    }
 });
});

//creating a new restaurant and linking it to a cuisine.
/*
    Sprint 2  US 4
    linking a restaurant to a certain cuisine in the database.
    The function takes the name of the restaurant and the name of the cuisine as inputs.
    and it creates relation LINKEDTO between this restaurant and that cuisine.
*/
describe('I can create a restaurant and link it to a certain cuisine already in the database', function () {
 it('A restaurant should be created and a relation LINKEDTO between this created restaurant and the chosen cuisine', function (done) {
     initialize();
     function initialize(){
        db.query('CREATE (:Cuisine { name:{np} })', params = {
        np: 'Sushi'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
    }
     function test(){
        db.query(queries.createResturantQuery, params = {
        np: 'Sushi Bay',
        cp:'Sushi'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
     });}
    function verify(){
        db.query('OPTIONAL MATCH (r:Restaurant {name: {np}})-[rel:HAS_CUISINE]->(c:Cuisine {name: {cp}}) RETURN rel;', params = {
        np: 'Sushi Bay',
        cp:'Sushi'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
             var relationship = results.map(function(result) {
                    return result['rel'];
            });
            should.exist(relationship);
            done();
        }
    });
    }
 });
});

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
describe('I can dislike a dish in a specific restaurant', function () {
 it('A dislike should be added and a score has to be added to follow relation', function (done) {
     initialize();
     function initialize(){
        db.query('create(:User{email:{ep}})-[:FOLLOWS{totalScore:0}]->(u:User{email:{ep1}}),(:Restaurant{name:{rp}})-[:HAS]->(:Dish{dish_name:{dp}})<-[:LIKES_DISH{likes:FALSE}]-(u)', params = {
        ep: 'kareemAdel4@mail.com',
        ep1: 'kareemAdel5@mail.com',
        rp: 'Spectra',
        dp: 'dish1'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
    }
     function test(){
        db.query(queries.createrDisLikeUserDishQuery, params = {
        ep: 'kareemAdel4@mail.com',
        dnp: 'dish1'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
     });}
    function verify(){
        db.query('optional MATCH (u:User {email: {ep}}), (u1:User {email: {ep1}}) , (d:Dish {dish_name: {dnp}}), (u)-[relLikes:LIKES_DISH {likes:FALSE}]->(d), (u)-[z:FOLLOWS]-(u1) return relLikes, z.totalScore', params = {
        ep: 'kareemAdel4@mail.com',
        ep1: 'kareemAdel5@mail.com',
        dnp: 'dish1'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var relLikes = results.map(function(result) {return result['relLikes'];});
            var totalScore = results.map(function(result) {return result['z.totalScore'];});
            should.exist(relLikes[0]);
            should(totalScore[0] == 7).be.ok;
            done();
        }
    });
    }
 });
});

/* Sprint #-0-US-2
    createDish(name):
    This function takes as input the dish's 
    name and creates the corresponding dish in the
    database using a CYPHER CREATE query.
*/
describe('create a Dish', function () {
 it('A dish should be created', function (done) {
     initialize();
     function initialize(){
            test();
    }
     function test(){
        db.query(queries.createDishQuery, params = {
        np: 'dish2'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
     });}
    function verify(){
        db.query('optional MATCH (dish:Dish { dish_name:{np} }) return dish', params = {
        np: 'dish2'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var dish = results.map(function(result) {return result['dish'];});
            should.exist(dish[0]);
            done();
        }
    });
    }
 });
});


/*
    I can like a dish in a specific restaurant.
    The function takes an email and Dish name and match the user and the dish.
    Then it creates a Relation LIKES_DISH Relation between the user and a dish,
    the attribute likes which is a boolean value indicates whether a user likes or dislikes a dish,
    in this case the value is TRUE, therefore a like is created.
    the score attribute in the LIKES_DISH relation indicates the value that
    affects the overall score of the relationship between the users.
    */
/*
describe('I can like a dish in a specific restaurant', function () {
 it('A like should be added and a score has to be added to follow relation', function (done) {
     initialize();
     function initialize(){
        db.query('create(:User{email:{ep}})-[:FOLLOWS{totalScore:0,score:1}]->(u:User{email:{ep1}}),(c:Cuisine{name:{cp}})<-[:HasCuisine]-(:Restaurant{name:{rp}})-[:HAS]->(:Dish{dish_name:{dp}})<-[:LIKES_DISH{likes:TRUE, score:7}]-(u)', params = {
        ep: 'kareemAdel6@mail.com',
        ep1: 'kareemAdel7@mail.com',
        rp: 'Pizza',
        cp: 'arabian',
        dp: 'dish2'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
    }
     function test(){
        db.query(queries.createrLikeUserDishQuery, params = {
        ep: 'kareemAdel6@mail.com',
        dnp: 'dish2'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
     });}
    function verify(){
        db.query('optional MATCH (u:User {email: {ep}}), (u1:User {email: {ep1}}) , (d:Dish {dish_name: {dnp}}), (u)-[relLikes:LIKES_DISH {likes:TRUE, score:7}]->(d), (u)-[z:FOLLOWS]-(u1) return relLikes, z.totalScore', params = {
        ep: 'kareemAdel6@mail.com',
        ep1: 'kareemAdel7@mail.com',
        dnp: 'dish2'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var relLikes = results.map(function(result) {return result['relLikes'];});
            var totalScore = results.map(function(result) {return result['z.totalScore'];});
            should.exist(totalScore[0]);
            should(totalScore[0] == 7).be.ok;
            done();
        }
    });
    }
 });
});
*/

/*  Sprint #-0-US-2
     addDishToRestaurant(dish, restaurant):
     this function takes as input the dishs and
     the restaurants name and creates the
     corresponding 'Has' relationship between this
     dish and this restaurant.
*/
describe('Add a Dish To a Restaurant', function () {
 it('A relation between a dish to a restaurant is added', function (done) {
     initialize();
     function initialize(){
        db.query('create (:Restaurant{name:{rp}}),(:Dish{dish_name:{dp}})', params = {
        rp: 'SteakOut',
        dp: 'dish3'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
    }
     function test(){
        db.query(queries.addDishToRestaurantQuery, params = {
        dp: 'dish3',
        rp: 'SteakOut'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
     });}
    function verify(){
        db.query('optional MATCH (d:Dish{dish_name:{dp}}),(r:Restaurant{name:{rp}}),(r)-[rel:HAS]->(d) return rel', params = {
        dp: 'dish3',
        rp: 'SteakOut'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var rel = results.map(function(result) {return result['rel'];});
            should.exist(rel[0]);
            done();
        }
    });
    }
 });
});

/*  
    Sprint #-1-US-2
    The user can add a photo related to a specific restaurant.
    This function takes the User Email, Restaurant Name and the Photo URL as an input
    Then the node p of type Photo is created  and a relationship "addPhoto"  is created
    between the user and the photo. Another relationship "IN"
    shows that the photo is in this specific restaurant.
*/


describe('The user can add a photo related to a specific restaurant', function () {
 it('A photo should be added to a restaurant', function (done) {
     initialize();
     function initialize(){
        db.query('create (:Restaurant{name:{rp}}),(:User{email:{up}})', params = {
        up: 'kareemAdel8@mail.com',
        rp: 'pizzaHut1'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
    }
     function test(){
        db.query(queries.UserAddsPhotoToRestaurantQuery, params = {
        ep: 'kareemAdel8@mail.com',
        rp: 'pizzaHut1',
        url: 'http://example.com/photo.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
     });}
    function verify(){
        db.query('optional MATCH (n:User { email:{ep} }),(r:Restaurant { name:{rp} }), (photo:Photo { url : {url}}), (n) -[photoRel:addPhoto]->(photo)-[inRel:IN]->(r) return photoRel, photo, inRel', params = {
        ep: 'kareemAdel8@mail.com',
        rp: 'pizzaHut1',
        url: 'http://example.com/photo.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var photoRel = results.map(function(result) {return result['photoRel'];});
            var photo = results.map(function(result) {return result['photo'];});
            var inRel = results.map(function(result) {return result['inRel'];});
            should.exist(photoRel[0]);
            should.exist(photo[0]);
            should.exist(inRel[0]);
            done();
        }
    });
    }
 });
});


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

describe('Follow a User', function () {
 it('A user should be followed', function (done) {
     initialize();
     function initialize(){
        db.query('create (:User{email:{u1}}),(:User{email:{u2}})', params = {
        u1: 'kareemAdel9@mail.com',
        u2: 'kareemAdel10@mail.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
    }
     function test(){
        db.query(queries.createFollowUserQuery, params = {
        e1p: 'kareemAdel9@mail.com',
        e2p: 'kareemAdel10@mail.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
     });}
    function verify(){
        db.query('optional MATCH (u1:User{email:{e1p}}),(u2:User{email:{e2p}}), (u1)-[f:FOLLOWS{ numberOfVisits :0 , totalScore :5}]->(u2) return f.numberOfVisits, f.totalScore', params = {
        e1p: 'kareemAdel9@mail.com',
        e2p: 'kareemAdel10@mail.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var numberOfVisits = results.map(function(result) {return result['f.numberOfVisits'];});
            var totalScore = results.map(function(result) {return result['f.totalScore'];});
            should(numberOfVisits[0] == 0).be.ok;
            should(totalScore[0] == 5).be.ok;
            done();
        }
    });
    }
 });
});


/*  User Story 19
    Sprint #-0-US-12
*/
describe('A user can unfollow a followed user', function () {
 it('A user should be unfollowed', function (done) {
    initialize();
    function initialize(){
        db.query('create (:User{email:{u1}}),(:User{email:{u2}})', 
            params = {
                u1: 'doola1@mail.com',
                u2: 'doola2@mail.com'
            }
        , function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            db.query(queries.createFollowUserQuery,
                params = {
                    e1p: 'doola1@mail.com',
                    e2p: 'doola2@mail.com'
                }, function(err, results) {
                    if(err) {
                        console.log('Error');
                        throw err;
                    }
                })
            test();
            }
        });
    }
    function test(){
        db.query(queries.deleterFollowUserUserQuery, 
            params = {
                e1p: 'doola1@mail.com',
                e2p: 'doola2@mail.com'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    verify();
                }
        });
   }
    function verify(){
        db.query('match (n:User)-[f:FOLLOWS]->(u:User) where n.email ={e1p} and u.email = {e2p} return count(f) ', 
            params = {
                e1p: 'doola1@mail.com',
                e2p: 'doola2@mail.com'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    var numberOfFollows = results.map(function(result) {return result['count(f)'];});
                    should(numberOfFollows[0] == 0).be.ok;
                    done();
                }
        });
    }
 });
});

/*  User Story 20
    Sprint #-1-US-9
    There is an error with this test even though the queries work
*/
describe('A user can share a photo', function () {
 it('new photo added with relation to user', function (done) {
     initialize();
     function initialize(){
        db.query('create (:User{email:{ep}}) , (:Photo{url:{url}})', 
            params = {
                ep: 'doolatest@mail.com',
                url: 'photo@url.com'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                        test();
                    }
        });
    }
     function test(){
        db.query(queries.UserSharesPhotoQuery, 
            params = {
                ep:'doolatest@mail.com',
                url:'photo@url.com'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    verify();
                }
         });
    }

    function verify(){
        db.query('optional MATCH (d:User{email:{ep}})-[:SHARE_PHOTO]->(p:Photo{url:{url}}) return d,p;', 
            params = {
                ep:'doolatest@mail.com',
                url:'photo@url.com'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    var users = results.map(function(result) {return result['d'];});
                    var photos = results.map(function(result) {return result['p'];});
                    should.exist(users[0]);
                    should.exist(photos[0]);
                    done();
                }
        });
    }
 });
});

/*
    User Story 29
    Sprint #0-US-1
*/

describe('A restaurant can be created', function () {
 it('A node representing a restaurant should be made', function (done) {
    test();
    function test(){
        db.query(queries.createResturantQuery, 
            params = {
                np: 'Pizza Hut'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    verify();
                }
        });
   }
    function verify(){
        db.query('match (n:Restaurant) where n.name ={r1} return n.name ', 
            params = {
                r1: 'Pizza Hut'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    var resName = results.map(function(result) {return result['n.name'];});
                    should(resName[0] == 'Pizza Hut').be.ok;
                    done();
                }
        });
    }
 });
});


//already done
/*  
    User Story 30
    Sprint #-0-US-2
*/
/*
describe('A dish can be created', function () {
 it('', function (done) {
    test();
    function test(){
        db.query(queries.createDishQuery, 
            params = {
                np: 'Chicken Masala'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    verify();
                }
        });
   }
    function verify(){
        db.query('match (n:Dish) where n.dish_name ={r1} return n.dish_name; ', 
            params = {
                r1: 'Chicken Masala'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    var dishName = results.map(function(result) {return result['n.dish_name'];});
                    should(dishName[0] == 'Chicken Masala').be.ok;
                    done();
                }
        });
    }
 });
});
*/
/*
    User Story 31
    Sprint #-0-US-3
*/

describe('A User can be created', function () {
 it('', function (done) {
    test();
    function test(){
        db.query(queries.createUserQuery, 
            params = {
                ep: 'TestUser'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    verify();
                }
        });
   }
    function verify(){
        db.query('match (n:User) where n.email ={u1} return n.email; ', 
            params = {
                u1: 'TestUser'
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    var userName = results.map(function(result) {return result['n.email'];});
                    should(userName[0] == 'TestUser').be.ok;
                    done();
                }
        });
    }
 });
});

/*
    User Story 32
    Sprint #-1-US-22
*/

describe('Add a new cuisine to a restaurant', function() {
    it('A new relationship HasCuisine should be added between the restaurant and the cuisine', function(done) {
        initialize();
        function initialize() {
            db.query("CREATE (:Restaurant {name: {rn}}), (:Cuisine {name: {cn}})", params = {
                rn: 'test restaurant',
                cn: 'test cuisine'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                test();
            });
        }
        function test() {
            db.query(queries.createRelCuisineRestaurantQuery, params = {
                rp: 'test restaurant',
                cp: 'test cuisine'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                verify();
            });
        }
        function verify() {
            db.query("OPTIONAL MATCH (r:Restaurant {name: {rn}})-[rel:HasCuisine]->(c:Cuisine {name: {cn}}) RETURN rel;", params = {
                rn: 'test restaurant',
                cn: 'test cuisine'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                var relationship = results.map(function(result) {
                    return result['rel'];
                });
                should.exist(relationship[0]);
                done();
            });
        }
    });
});

/*
    User Story S8
    Sprint #-1-US-3
*/

describe('The user can add a photo yum to a certain photo', function() {
    it('A photo yum relation is added to a certain photo', function(done) {
        initialize();
        function initialize() {
            db.query("CREATE (:Photo {url: {url}}),(:User {email: {ep}})", params = {
                url: 'myPhotoURL',
                ep: 'kareemAdel11@mail.com'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                test();
            });
        }
        function test() {
            db.query(queries.UserAddPhotoYumsQuery, params = {
                ep: 'kareemAdel11@mail.com',
                url: 'myPhotoURL'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                verify();
            });
        }
        function verify() {
            db.query("optional match (user:User {email: {ep}}), (photo:Photo {url: {url}}) optional match (user)-[y1:YUM_YUCK {value: TRUE, score: 3}]->(photo) optional match (user)-[y2:YUM_YUCK {value: FALSE, score: 3}]->(photo) return y1,y2", params = {
                ep: 'kareemAdel11@mail.com',
                url: 'myPhotoURL'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                var y1 = results.map(function(result) {
                    return result['y1'];
                });
                var y2 = results.map(function(result) {
                    return result['y2'];
                });
                should.exist(y1[0]);
                should.not.exist(y2[0]);
                done();
            });
        }
    });
});

/*
    User Story S9
    Sprint #-1-US-4
*/

describe('The user can delete a photo yum in a certain photo', function() {
    it('a photo yum relation should be removed', function(done) {
        initialize();
        function initialize() {
            db.query("CREATE (:User {email: {ep}})-[:YUM_YUCK {value: FALSE, score: 3}]->(:Photo {url: {url}})", params = {
                url: 'myPhotoURL1',
                ep: 'kareemAdel12@mail.com'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                test();
            });
        }
        function test() {
            db.query(queries.UserDeletePhotoYumQuery, params = {
                ep: 'kareemAdel12@mail.com',
                url: 'myPhotoURL1'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                verify();
            });
        }
        function verify() {
            db.query("optional match (user:User {email: {ep}}), (photo:Photo {url: {url}}) optional match (user)-[y1:YUM_YUCK {value: TRUE, score: 3}]->(photo) return y1", params = {
                ep: 'kareemAdel12@mail.com',
                url: 'myPhotoURL1'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                var y1 = results.map(function(result) {
                    return result['y1'];
                });
                should.not.exist(y1[0]);
                done();
            });
        }
    });
});

/*
    User Story S10
    Sprint #-1-US-5
*/

describe('The user can add a photo yuck to a certain photo.', function() {
    it('a photo yuck relation should be added.', function(done) {
        initialize();
        function initialize() {
            db.query("CREATE (:User {email: {ep}}),(:Photo {url: {url}})", params = {
                url: 'myPhotoURL2',
                ep: 'kareemAdel13@mail.com'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                test();
            });
        }
        function test() {
            db.query(queries.UserAddPhotoYucksQuery, params = {
                ep: 'kareemAdel13@mail.com',
                url: 'myPhotoURL2'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                verify();
            });
        }
        function verify() {
            db.query("optional match (user:User {email: {ep}}), (photo:Photo {url: {url}}) optional match (user)-[y1:YUM_YUCK {value: FALSE, score: 3}]->(photo) return y1", params = {
                ep: 'kareemAdel13@mail.com',
                url: 'myPhotoURL2'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                var y1 = results.map(function(result) {
                    return result['y1'];
                });
                should.exist(y1[0]);
                done();
            });
        }
    });
});


/*
    User Story S11
    Sprint #-1-US-6
*/

describe('The user can delete a photo yuck in a certain photo.', function() {
    it('a photo yuck relation should be deleted.', function(done) {
        initialize();
        function initialize() {
            db.query("CREATE (:User {email: {ep}})-[:YUM_YUCK {value: FALSE, score: 3}]->(:Photo {url: {url}})", params = {
                url: 'myPhotoURL3',
                ep: 'kareemAdel14@mail.com'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                test();
            });
        }
        function test() {
            db.query(queries.UserDeletePhotoYuckQuery, params = {
                ep: 'kareemAdel14@mail.com',
                url: 'myPhotoURL3'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                verify();
            });
        }
        function verify() {
            db.query("optional match (user:User {email: {ep}}), (photo:Photo {url: {url}}) optional match (user)-[y1:YUM_YUCK {value: FALSE, score: 3}]->(photo) return y1", params = {
                ep: 'kareemAdel14@mail.com',
                url: 'myPhotoURL3'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                var y1 = results.map(function(result) {
                    return result['y1'];
                });
                should.not.exist(y1[0]);
                done();
            });
        }
    });
});


/*
    User Story 14 & 15
    Sprint #-1-US-7
*/

describe('I can share restaurant on facebook', function() {
    it('Should create a relation between the restaurant and the user called [SHARE_RESTAURANT]', function(done) {
        initialize();
        function initialize() {
            db.query("create (user:User {email: {ep}}), (restaurant:Restaurant {name: {rn}})", params = {
                    ep: 'kareemAdel15@mail.com',
                    rn: 'RestaurantKareem15'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                test();
            });
        }
        function test() {
            db.query(queries.UserSharesRestaurantQuery, params = {
                    ep: 'kareemAdel15@mail.com',
                    rn: 'RestaurantKareem15'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                verify();
            });
        }
        function verify() {
            db.query("optional MATCH (user:User {email: {ep}}), (restaurant:Restaurant {name: {rn}}), (s:Scores) with user,restaurant,s optional MATCH (user)-[y1:SHARE_RESTAURANT {score:s.shareRestaurantScore}]->(restaurant) return y1", params = {
                    ep: 'kareemAdel15@mail.com',
                    rn: 'RestaurantKareem15'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                var y1 = results.map(function(result) {
                    return result['y1'];
                });
                should.exist(y1[0]);
                done();
            });
        }
    });
});


/*
    User Story S21
    Sprint #-1-US-8
*/

describe('The user can share a dish on facebook or twitter.', function() {
    it('Should create a relation between the dish and the user called [SHARE_DISH]', function(done) {
        initialize();
        function initialize() {
            db.query("create (:User {email: {ep}}), (:Dish {dish_name: {dn}})", params = {
                    ep: 'kareemAdel16@mail.com',
                    dn: 'DishKareem16'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                test();
            });
        }
        function test() {
            db.query(queries.UserSharesDishQuery, params = {
                    ep: 'kareemAdel16@mail.com',
                    dn: 'DishKareem16'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                verify();
            });
        }
        function verify() {
            db.query("optional MATCH (user:User {email: {ep}}), (dish:Dish {dish_name: {dn}}), (s:Scores) optional MATCH (user)-[y1:SHARE_DISH {score:s.shareDishScore}]->(dish) return y1", params = {
                    ep: 'kareemAdel16@mail.com',
                    dn: 'DishKareem16'
            }, function(err, results) {
                if (err)
                {
                    console.error('Error');
                    throw err;
                }
                var y1 = results.map(function(result) {
                    return result['y1'];
                });
                should.exist(y1[0]);
                done();
            });
        }
    });
});
/*
    Sprint 1  US 21
    createCuisine(name):
    This function takes as input the Cuisine's
    name and creates the corresponding cuisine in the
    database.
    (S2US4) linking a newly added cuisine to all the users in the database.
    The function takes the name of the cuisine as an input.
    and it creates relation TOTALSCORE between this cuisine and each user in the database and setting the initial score to 0 between each user and this cuisine.
*/
/*
    Sprint 2  US 4
    linking a newly added cuisine to all the users in the database.
    The function takes the name of the cuisine as an input.
    and it creates relation TOTALSCORE between this cuisine and each user in the database
    and setting the initial score to 0 between each user and this cuisine.
*/ 
describe('I can create a cuisine', function () {
 it('Should add a cuisine to the database and connect it to all the available users in the database', function (done) {
     initialize();
     function initialize(){
        db.query('CREATE (:User { email:{ep} })', params = {
                ep:'khaled'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
    }
   function test(){
        db.query(queries.createCuisineQuery, params = {
        np: 'Sushi'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
    });
   }
    function verify(){
        db.query('OPTIONAL MATCH (u:User)-[rel:TOTALSCORE]->(c:Cuisine {name: {np}}) RETURN rel;', params = {
        np: 'Sushi'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var relationship = results.map(function(result) {
                    return result['rel'];
            });
            should.exist(relationship);
            done();
        }
    });
    }
 });
});


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

describe('Score increases between user and cuisine when he addes a photo to a restaurant', function () {
 it('Score should increase between user and cuisine', function (done) {
     initialize();
     function initialize(){
        db.query('create (:Restaurant{name:{rp}}),(u:User{email:{up}}), (c:Cuisine{name:{cp}}), u-[:LIKECUISINE{score:0}]->c', params = {
        up: 'UserCuisineScoreTest.com',
        rp: 'ResCuisineScoreTest',
        cp: 'CuisCuisineScoreTest'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            //test();
            db.query(queries.createRelCuisineRestaurantQuery, params = {
            cp: 'CuisCuisineScoreTest',
            rp: 'ResCuisineScoreTest'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            //test();
                db.query(queries.UserAddsPhotoToRestaurantQuery, params = {
                    ep: 'UserCuisineScoreTest.com',
                    rp: 'ResCuisineScoreTest',
                    url: 'photoURL'
                 }, function(err, results) {
                    if (err) {
                            console.error('Error');
                            throw err;
                    } else {
                        test();
                     }
                });
        }
    });
        }
    });
    }
     function test(){
        db.query(queries.UserAddsPhotoToRestaurantScore, params = {
                    ep: 'UserCuisineScoreTest.com',
                    rp: 'ResCuisineScoreTest',
                    url: 'photoURL'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
     });}
    function verify(){
        db.query('optional MATCH (n:User { email:{ep} }),(c:Cuisine{name:{cp}}), (n) -[l:LIKECUISINE]->(c) return l.score', params = {
        ep: 'UserCuisineScoreTest.com',
        cp: 'CuisCuisineScoreTest'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var scoreAfterAdd = results.map(function(result) {return result['l.score'];});
            should(Number(scoreAfterAdd)).be.exactly(10)
            done();
        }
    });
    }
 });
});


function formQuery(Query,params){
	for (var key in params) {
	if (params.hasOwnProperty(key)) {
	Query = Query.replace("{" + key + "}","'" + params[key] + "'");
	}
	}
	return Query;
}


/*
Sprint2-S3
*/


describe('A restaurant can be suggested', function () {
 it('A list of restaurants should be outputed', function (done) {
    test();
    function test(){
        db.query("MATCH (n:User{email:'menna@mail.com'}), (u:User), (d:Dish{dish_name:'Dumplings'}), (c:Cuisine), (di:Dish), (r:Restaurant),(re:Restaurant), (n)-[:FOLLOWS]->(u),(n)-[:LIKES_DISH]->(d), (u)-[:LIKES_DISH]->(di), (d)<-[:Has]-(r), (di)<-[:Has]-(re), (re)-[:HasCuisine]->(c)<-[:HasCuisine]-(r) WHERE re <> r AND d <> di WITH DISTINCT(re) AS RE RETURN RE.name;", params = {
           }, function(err, results) {
                 if (err)
                 {
                     console.error('Error');
                     throw err;
                 }
                 else{
                    var resName = results.map(function(result) {
                    return result['RE.name'];});
                    should(resName[0] == 'Spectra').be.ok;
                    //should(resName[1] == 'Burger King').be.ok;
                    done();
    }
 });

}
});
});
//14-I can add a restaurant to favourites.
//BackLog user story 39
//Sprint #2 us 12
//The function takes as inputs the email of the user and the name of the restaurant 
//and it gets the nodes of the restaurant and the user and creates a new relation called 
//FAVORITES between the two nodes.
//In the callback of the 1st query, it calls another query which increases the score 
//between the user and the cuisines of the restaurant by value = favouritesScore
//which is defined in the database 
describe('Score increases between user and cuisine when he addes this restaurant to favorites', function () {
 it('Score should increase between user and cuisine2', function (done) {
     initialize();
     function initialize(){
        db.query('create (:Restaurant{name:{rp}}),(u:User{email:{up}}), (c:Cuisine{name:{cp}}), u-[:LIKECUISINE{score:0}]->c', params = {
                up: 'UserCuisineScoreTest2.com',
                rp: 'ResCuisineScoreTest2',
                cp: 'CuisCuisineScoreTest2'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            db.query(queries.createRelCuisineRestaurantQuery, params = {
                cp: 'CuisCuisineScoreTest2',
                rp: 'ResCuisineScoreTest2'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            db.query(queries.createrFavouriteUserRestaurantQuery, params = {
                ep: 'UserCuisineScoreTest2.com',
                rp: 'ResCuisineScoreTest2'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            test();
        }
    });
        }
    });
        }
    });
    }
   function test(){
        db.query(queries.createrFavouriteUserRestaurantScore, params = {
                ep: 'UserCuisineScoreTest2.com',
                rp: 'ResCuisineScoreTest2'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
    });
   }
    function verify(){
        db.query('optional MATCH (n:User { email:{ep} }),(c:Cuisine{name:{cp}}), (n) -[l:LIKECUISINE]->(c) return l.score', params = {
        ep: 'UserCuisineScoreTest2.com',
        cp: 'CuisCuisineScoreTest2'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var scoreAfterFav = results.map(function(result) {return result['l.score'];});
            should(Number(scoreAfterFav)).be.exactly(10)
            done();
        }
    });
    }
 });
});
describe('score changes between user and cuisine on making yum on photo', function () {
 it('Sscore should increases on making yums', function (done) {
     initialize();
     function initialize(){
        db.query('CREATE (:User { email:{ep} })', params = {
                ep:'Hossamtest1'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
             db.query('CREATE (:Restaurant { name:{ep} })', params = {
                ep:'Hossamtest1'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
             db.query('CREATE (:Cuisine { name:{ep} })', params = {
                ep:'Hossamtest1'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			db.query("MATCH (n:User { email:{ep} }),(r:Restaurant { name:{rp} }) CREATE (p:Photo { url : {url}}), (n) -[:addPhoto]->(p)-[:IN]->(r)", params = {
         ep: 'Hossamtest1',
        rp: 'Hossamtest1',
        url: 'Hossamtest1'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			db.query( "MATCH (r:Restaurant { name:{np} }) , (c:Cuisine { name:{cp} }) CREATE (r)-[:HAS_CUISINE]->(c)", params = {
                np: 'Hossamtest1',
        		cp:'Hossamtest1'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			db.query("MATCH (u:User{email:'Hossamtest1'}),(c:Cuisine{name:'Hossamtest1'}) CREATE (u)-[:LIKECUISINE{score:0}]->(c)", params = {
                ep:'Hossamtest1'
        }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			test();
        }
    });
        }
    });
        }
    });
            
			
		
        }
    });
        }
    });
        }
    });
    }
   function test(){
        db.query(queries.UserAddPhotoYumsScore, params = {
        ep: 'Hossamtest1',url:'Hossamtest1'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
    });
   }
    function verify(){
        db.query("OPTIONAL MATCH (u:User{email:'Hossamtest1'})-[rel:LIKECUISINE]->(c:Cuisine {name: {np}}) RETURN rel.score;", params = {
        np: 'Hossamtest1'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var relationship = results.map(function(result) {
                    return result['rel.score'];
            });
            should(Number(relationship)).be.exactly(5);
            done();
        }
    });
    }
 });
});
describe('score changes between user and cuisine on making yucks on photo', function () {
 it('Sscore should decreases on making yucks', function (done) {
     initialize();
     function initialize(){
        test();
    }
   function test(){
        db.query(queries.UserAddPhotoYucksScore, params = {
        ep: 'Hossamtest1',url:'Hossamtest1'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            verify();
        }
    });
   }
    function verify(){
        db.query("OPTIONAL MATCH (u:User{email:'Hossamtest1'})-[rel:LIKECUISINE]->(c:Cuisine {name: {np}}) RETURN rel.score;", params = {
        np: 'Hossamtest1'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
            var relationship = results.map(function(result) {
                    return result['rel.score'];
            });
            should(Number(relationship)).be.exactly(0);
            done();
        }
    });
    }
 });
});

//Sprint-2-US-6
describe('A Global Node can be created', function () {
 it('A Global node representing having all the new scores should be created', function (done) {
    test();
    function test(){
        db.query(queries.createGlobalNodeQuery, 
            params = {
                ep1: 1,
                ep2: 2,
                ep3: 3,
                ep5: 5,
                ep6: 6,
                ep7: 7,
                ep8: 8,
                ep9: 9,
                ep10: 10,
                ep11: 11
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    verify();
                }
        });
   }
    function verify(){
        db.query('    match (s:Scores) where s.followsScore ={ep1} AND s.reviewScore ={ep2} AND s.likesDishScore ={ep3} AND s.addPhotoScore ={ep5} AND s.yum_yuckScore ={ep6} AND s.shareRestaurantScore ={ep7} AND s.shareDishScore ={ep8} AND s.sharePhotoScore= {ep9} AND s.favouritesScore ={ep10} AND  s.likeCuisineScore ={ep11} return s',         
            params = {
                ep1: 1,
                ep2: 2,
                ep3: 3,
                ep5: 5,
                ep6: 6,
                ep7: 7,
                ep8: 8,
                ep9: 9,
                ep10: 10,
                ep11: 11
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                      var relationship = results.map(function(result) {
                    return result['s'];
                 });
                should.exist(relationship);
                done();
                }
        });
    }
 });
});
