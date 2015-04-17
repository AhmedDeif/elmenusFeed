
/**
 * Module dependencies.
 */

 var express = require('express')
  , routes = require('./routes');

 var neo4j = require('neo4j');
 var queries = require('./queries.js');
 var db = new neo4j.GraphDatabase('http://localhost:7474');
 var app = module.exports = express.createServer();


// Configuration

 app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
   });

 app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
   });

 app.configure('production', function(){
    app.use(express.errorHandler());
   });

// Routes

app.get('/', routes.index);
app.get('/Get_restaurant_info/:tagId', routes.Get_restaurant_info);
app.get('/relations_view', routes.relationsView);
app.post('/relations', function(req, res) {
  var relation = req.param("rels");
  res.redirect('/Get_relation_info/' + relation);
})
app.get('/add_dish', routes.newDish);
app.post('/new_dish', function(req, res) {
	var dishName = req.body.dishName;
	var restaurant = req.param("rests");
  queries.createDishAndRestaurant(dishName, restaurant);
	res.redirect('/add_dish');
})
app.get('/costChange', routes.costChange);
app.post('/costChange', function(req, res) {
  var cost = req.body.cost;
  var relation = req.body.relation;
  queries.changeRelationCost(relation, cost);
  res.redirect('/Relations');
})
app.get('/Relations', routes.Relations);
app.post('/Relations', function(req, res) {
  var relation = req.param("select");
  res.redirect('/costChange');
})
app.get('/signup', routes.signUp);
app.post('/sign_up', function(req, res) {
  var email = req.body.email;
  queries.createUser(email);
  res.redirect('/signup');
})

app.get('/add_review', routes.newReview);
app.post('/new_review', function(req, res) {
  
    var Email = req.body.email;
    var restaurantName = req.body.restaurantName;

  var reviewTitle = req.body.reviewTitle;

  var reviewBody = req.body.reviewBody;

  queries.createrReviewUserToRestaurant(Email,restaurantName,reviewTitle,reviewBody);
  res.redirect('/add_review');
})

app.get('/login', routes.login);
app.post('/log_in', function(req, res) {
  var email = req.body.email;
  queries.checkUserExists(email, function(count) {
    if (count == 1)
      res.redirect('/login'); //should redirect to newsfeed passing user email by :tagId (like in /relations_view)
    else
    {
      console.log("User was not found!");
      res.redirect('/login');
    }
  });
});

 app.listen(3000);
 console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


 // This part is for testing queries

/*queries.createUser("test 1");
queries.createUser("test 2");
queries.createUser("test 3");
queries.createUser("test 4");
queries.createUser("test 5");
queries.createResturant("Res 1");
queries.createResturant("Res 2");
queries.createResturant("Res 3");
queries.createResturant("Res 4");
queries.createResturant("Res 5");
queries.createDish("Dish 1");
queries.createDish("Dish 2");
queries.createDish("Dish 3");
queries.createDish("Dish 4");
queries.createDish("Dish 5");
queries.createDish("Dish 6");
queries.createDish("Dish 7");


queries.addDishToRestaurant("Dish 1","Res 1");
queries.addDishToRestaurant("Dish 2","Res 1");
queries.addDishToRestaurant("Dish 3","Res 1");
queries.addDishToRestaurant("Dish 4","Res 2");
queries.addDishToRestaurant("Dish 5","Res 2");
queries.addDishToRestaurant("Dish 6","Res 3");
queries.addDishToRestaurant("Dish 7","Res 3");
queries.addDishToRestaurant("Dish 1","Res 3");
queries.addDishToRestaurant("Dish 2","Res 4");
queries.addDishToRestaurant("Dish 3","Res 5");
queries.addDishToRestaurant("Dish 4","Res 5");


// common 1 & 2 = 2
// common 1 & 3 = 1
// common 1 & 4 = 0
// 
// common 2 & 3 = 1
// common 3 & 1 = 1

queries.createFollowUser("test 1","test 2");
queries.createFollowUser("test 1","test 3");
queries.createFollowUser("test 1","test 4");
queries.createFollowUser("test 1","test 5");
//queries.createFollowUser("test 2","test 1");
queries.createFollowUser("test 2","test 3");
queries.createFollowUser("test 2","test 4");
//queries.createFollowUser("test 3","test 1");
queries.createFollowUser("test 3","test 4");
queries.createFollowUser("test 4","test 1");
queries.createFollowUser("test 5","test 2");




queries.findCommonFollowers("test 1","test 2");
queries.findCommonFollowers("test 1","test 3");
queries.findCommonFollowers("test 1","test 4");
queries.findCommonFollowers("test 1","test 5");
queries.findCommonFollowers("test 2","test 3");
queries.findCommonFollowers("test 2","test 4");
queries.findCommonFollowers("test 3","test 4");
queries.findCommonFollowers("test 2","test 5");

*/

queries.setFollowersScore("test 1","test 2");
queries.setFollowersScore("test 1","test 3");
queries.setFollowersScore("test 1","test 4");
queries.setFollowersScore("test 1","test 5");
queries.setFollowersScore("test 2","test 3");
queries.setFollowersScore("test 2","test 4");
queries.setFollowersScore("test 3","test 4");
queries.setFollowersScore("test 2","test 5");



