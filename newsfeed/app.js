
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
app.get('/Get_relation_info/:tagId', routes.Get_relation_info);
app.get('/add_dish', routes.addDish);
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
app.get('/users_view', routes.usersView);
app.post('/users', function(req, res) {
  var user = req.param("usrs");
  res.redirect('/Get_user_info/' + user);   
})
app.get('/Get_user_info/:tagId', routes.Get_user_info);
app.get('/login', routes.login);
app.post('/log_in', function(req, res) {
  var email = req.body.email;
  queries.checkUserExists(email, function(count) {
    if (count == 1)
      res.redirect('/newsfeed/' + email); //should redirect to newsfeed passing user email by :tagId (like in /relations_view)
    else
    {
      console.log("User was not found!");
      res.redirect('/login');
    }
  });
});

app.get('/newsfeed/:email', routes.showNewsfeed);

 app.listen(3000);
 console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

//queries.createGlobalNode(4, 9, 7, 0, 14, 13, 12, 11, 10, 8, 6);
//queries.createTimeDecay(5000000);
 // This part is for testing queries
 
/*
queries.createDish("Dish 1");
queries.createDish("Dish 2");
queries.createDish("Dish 3");
queries.createDish("Dish 4");
queries.createDish("Dish 5");
queries.createDish("Dish 6");
queries.createDish("Dish 7");
queries.createCuisine("Pizza");
queries.createCuisine("Pasta");
queries.createCuisine("Burger");




queries.createUser("test 1");
queries.createUser("test 2");
queries.createUser("test 3");
queries.createUser("test 4");
queries.createUser("test 5");
queries.createUser("test 6");
queries.createUser("test 7");
queries.createResturant("Res 1");
queries.createResturant("Res 2");
queries.createResturant("Res 3");
queries.createResturant("Res 4");
queries.createResturant("Res 5");
/*
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
/*
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


/*

queries.findCommonFollowers("test 1","test 2");
queries.findCommonFollowers("test 1","test 3");
queries.findCommonFollowers("test 1","test 4");
queries.findCommonFollowers("test 1","test 5");
queries.findCommonFollowers("test 2","test 3");
queries.findCommonFollowers("test 2","test 4");
queries.findCommonFollowers("test 3","test 4");
queries.findCommonFollowers("test 2","test 5");



queries.setFollowersScore("test 1","test 2");
queries.setFollowersScore("test 1","test 3");
queries.setFollowersScore("test 1","test 4");
queries.setFollowersScore("test 1","test 5");
queries.setFollowersScore("test 2","test 3");
queries.setFollowersScore("test 2","test 4");
queries.setFollowersScore("test 3","test 4");
queries.setFollowersScore("test 2","test 5");



queries.createrFavouriteUserRestaurant("test 2","Res 2");
queries.createrFavouriteUserRestaurant("test 2","Res 1");
queries.createrFavouriteUserRestaurant("test 2","Res 3");
queries.createrFavouriteUserRestaurant("test 3","Res 1");
queries.createrFavouriteUserRestaurant("test 4","Res 4");
queries.createrFavouriteUserRestaurant("test 2","Res 3");
queries.createrFavouriteUserRestaurant("test 1","Res 5");


queries.UserAddsPhotoToRestaurant("test 1", "Res 1", "photo 1");
queries.UserAddsPhotoToRestaurant("test 1", "Res 2", "photo 2");
queries.UserAddsPhotoToRestaurant("test 1", "Res 3", "photo 3");


queries.UserAddPhotoYums("test 3", "photo 1");
queries.UserAddPhotoYums("test 1", "photo 1");
queries.UserAddPhotoYums("test 4", "photo 2");
queries.UserAddPhotoYums("test 2", "photo 2");
queries.UserAddPhotoYums("test 1", "photo 2");


queries.UserCommonYumsUser("test 2", "test 3");

*/


//  First run
/*
queries.createGlobalNode(1,6,5,8,10,9,7,4,3,2,1);
queries.createDish("Dish 1");
queries.createDish("Dish 2");
queries.createDish("Dish 3");
queries.createDish("Dish 4");
queries.createDish("Dish 5");
queries.createDish("Dish 6");
queries.createDish("Dish 7");
queries.createCuisine("Pizza");
queries.createCuisine("Pasta");
queries.createCuisine("Burger");
queries.createCuisine("Pie");


// Second run

queries.createUser("test 1");
queries.createUser("test 2");
queries.createUser("test 3");
queries.createUser("test 4");
queries.createUser("test 5");
queries.createUser("test 6");
queries.createUser("test 7");

queries.createResturant("Res 1","Pizza");
queries.createResturant("Res 2","Pizza");
queries.createResturant("Res 3","Pasta");
queries.createResturant("Res 4","Pie");
queries.createResturant("Res 5","Burger");



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

queries.createFollowUser("test 1","test 2");
queries.createFollowUser("test 1","test 3");
queries.createFollowUser("test 1","test 4");
queries.createFollowUser("test 1","test 5");
queries.createFollowUser("test 2","test 1");
queries.createFollowUser("test 2","test 3");
queries.createFollowUser("test 2","test 4");
queries.createFollowUser("test 3","test 1");
queries.createFollowUser("test 3","test 4");
queries.createFollowUser("test 4","test 1");
queries.createFollowUser("test 5","test 2");

*/
queries.createrFavouriteUserRestaurant("test 2","Res 2");
queries.createrFavouriteUserRestaurant("test 2","Res 1");
queries.createrFavouriteUserRestaurant("test 2","Res 3");
queries.createrFavouriteUserRestaurant("test 3","Res 1");
queries.createrFavouriteUserRestaurant("test 4","Res 4");
queries.createrFavouriteUserRestaurant("test 2","Res 3");
queries.createrFavouriteUserRestaurant("test 1","Res 5");





queries.UserAddsPhotoToRestaurant("test 2", "Res 2", "photo 4");

queries.UserAddsPhotoToRestaurant("test 4", "Res 3", "photo 8");
queries.UserAddsPhotoToRestaurant("test 1", "Res 1", "photo 1");
queries.UserAddsPhotoToRestaurant("test 1", "Res 2", "photo 2");
queries.UserAddsPhotoToRestaurant("test 1", "Res 3", "photo 3");

/*
queries.UserAddPhotoYums("test 3", "photo 1");
queries.UserAddPhotoYums("test 1", "photo 1");
queries.UserAddPhotoYums("test 4", "photo 2");
queries.UserAddPhotoYums("test 2", "photo 2");
queries.UserAddPhotoYums("test 1", "photo 2");

*/