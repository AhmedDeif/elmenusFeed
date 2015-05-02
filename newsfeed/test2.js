var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');

queries.addDishToRestaurant('dish1','restaurant1');
queries.addDishToRestaurant('dish2','restaurant1');
queries.addDishToRestaurant('dish3','restaurant1');
queries.addDishToRestaurant('dish4','restaurant1');
queries.addDishToRestaurant('dish5','restaurant1');
queries.addDishToRestaurant('dish6','restaurant1');
queries.addDishToRestaurant('dish7','restaurant1');

queries.addDishToRestaurant('dish8','restaurant2');
queries.addDishToRestaurant('dish9','restaurant2');
queries.addDishToRestaurant('dish10','restaurant2');

queries.addDishToRestaurant('dish11','restaurant3');
queries.addDishToRestaurant('dish12','restaurant3');
queries.addDishToRestaurant('dish13','restaurant3');

queries.UserAddsPhotoToRestaurant('kareem1@mail.com','restaurant1','photo1');
queries.UserAddsPhotoToRestaurant('kareem1@mail.com','restaurant2','photo2');
queries.UserAddsPhotoToRestaurant('kareem1@mail.com','restaurant3','photo3');
queries.UserAddsPhotoToRestaurant('kareem2@mail.com','restaurant2','photo4');
queries.UserAddsPhotoToRestaurant('kareem2@mail.com','restaurant2','photo5');
queries.UserAddsPhotoToRestaurant('kareem2@mail.com','restaurant2','photo6');

queries.createrFavouriteUserRestaurant('kareem1@mail.com','restaurant1');
queries.createrFavouriteUserRestaurant('kareem1@mail.com','restaurant2');
queries.createrFavouriteUserRestaurant('kareem1@mail.com','restaurant3');

queries.createrFavouriteUserRestaurant('kareem2@mail.com','restaurant1');
queries.createrFavouriteUserRestaurant('kareem2@mail.com','restaurant2');
queries.createrFavouriteUserRestaurant('kareem2@mail.com','restaurant3');
