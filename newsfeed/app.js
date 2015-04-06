
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
app.get('/add_dish', routes.newDish);
app.post('/new_dish', function(req, res) {
	var dishName = req.body.dishName;
	var restaurant = req.body.restaurant;
	queries.createDish(dishName);
	queries.addDishToRestaurant(dishName, restaurant);
	res.redirect('/add_dish');
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

 app.listen(3000);
 console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
