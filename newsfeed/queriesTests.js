var should = require('should');
var assert = require('assert');
var queries = require('./queries.js');
var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');


//(S3) I can sign up.
//The function takes the email of the user as an input.
//and it creates a new user.
describe('I can sign up', function () {
 it('Should add a user to the database', function (done) {
	 initialize();
	 function initialize(){
		db.query('match n optional match ()-[r]-() delete r,n', params = {}
		, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			test();
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
		db.query('optional match (n:User { email:{ep} })return n', params = {
        ep: 'kareemAdel@mail.com'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			var user = results.map(function(result) {return result['n'];});
			should.exist(user[0]);
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

	/*
    I can create a restaurant
    */
describe('I can create a restaurant', function () {
 it('A restaurant should be created', function (done) {
	 initialize();
	 function initialize(){
			test();
	}
	 function test(){
		db.query(queries.createResturantQuery, params = {
        np: 'Peking'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			verify();
		}
	 });}
	function verify(){
		db.query('optional MATCH (Res:Restaurant { name:{np} }) return Res', params = {
        np: 'Peking'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			var Res = results.map(function(result) {return result['Res'];});
			should.exist(Res[0]);
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
		db.query('create(:User{email:{ep}})-[:FOLLOWS{totalScore:0,score:1}]->(u:User{email:{ep1}}),(:Restaurant{name:{rp}})-[:HAS]->(:Dish{dish_name:{dp}})<-[:LIKES_DISH{likes:FALSE, score:7}]-(u)', params = {
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
		db.query('optional MATCH (u:User {email: {ep}}), (u1:User {email: {ep1}}) , (d:Dish {dish_name: {dnp}}), (u)-[relLikes:LIKES_DISH {likes:FALSE, score:7}]->(d), (u)-[z:FOLLOWS]-(u1) return relLikes, z.totalScore', params = {
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
	add a new Dish to a Restaurant.
*/

describe('Add a new Dish to a Restaurant', function () {
 it('A new dish should be added to the restaurant', function (done) {
	 initialize();
	 function initialize(){
		db.query('create (:Restaurant{name:{rp}})', params = {
		rp: 'pizzaHut'
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
		db.query(queries.createDishAndRestaurantQuery, params = {
        dp: 'dish4',
        rp: 'pizzaHut'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			verify();
		}
	 });}
	function verify(){
		db.query('optional MATCH (d:Dish{dish_name:{dp}}),(r:Restaurant{name:{rp}}),(r)-[rel:HAS]->(d) return rel,d', params = {
        dp: 'dish4',
        rp: 'pizzaHut'
    }, function(err, results) {
        if (err) {
            console.error('Error');
            throw err;
        } else {
			var rel = results.map(function(result) {return result['rel'];});
			var dish = results.map(function(result) {return result['d'];});
			should.exist(rel[0]);
			should.exist(dish[0]);
			done();
		}
    });
	}
 });
});


/*  Sprint #-1-US-2
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

function formQuery(Query,params){
	for (var key in params) {
	if (params.hasOwnProperty(key)) {
	Query = Query.replace("{" + key + "}","'" + params[key] + "'");
	}
	}
	return Query;
}