var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');

queries.createDishAndRestaurant('dish1','restaurant1');
queries.createDishAndRestaurant('dish2','restaurant1');
queries.createDishAndRestaurant('dish3','restaurant1');

queries.createDishAndRestaurant('dish1','restaurant2');
queries.createDishAndRestaurant('dish2','restaurant2');
queries.createDishAndRestaurant('dish3','restaurant2');

queries.createDishAndRestaurant('dish1','restaurant3');
queries.createDishAndRestaurant('dish2','restaurant3');
queries.createDishAndRestaurant('dish3','restaurant3');

queries.UserAddsPhotoToRestaurant('kareem1@mail.com','restaurant1','photo1');
queries.UserAddsPhotoToRestaurant('kareem1@mail.com','restaurant2','photo2');
queries.UserAddsPhotoToRestaurant('kareem1@mail.com','restaurant3','photo3');
queries.UserAddsPhotoToRestaurant('kareem2@mail.com','restaurant2','photo4');

queries.createrFavouriteUserRestaurant('kareem1@mail.com','restaurant1');
queries.createrFavouriteUserRestaurant('kareem1@mail.com','restaurant2');
queries.createrFavouriteUserRestaurant('kareem1@mail.com','restaurant3');
