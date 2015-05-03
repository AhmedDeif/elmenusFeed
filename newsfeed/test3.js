var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');


queries.UserAddsPhotoToRestaurant('kareem1@mail.com','restaurant1','photo1');
queries.UserAddsPhotoToRestaurant('kareem1@mail.com','restaurant2','photo2');
queries.UserAddsPhotoToRestaurant('kareem1@mail.com','restaurant3','photo3');
queries.UserAddsPhotoToRestaurant('kareem2@mail.com','restaurant1','photo4');
queries.UserAddsPhotoToRestaurant('kareem2@mail.com','restaurant2','photo5');
queries.UserAddsPhotoToRestaurant('kareem2@mail.com','restaurant3','photo6');
queries.UserAddsPhotoToRestaurant('kareem3@mail.com','restaurant2','photo7');
queries.UserAddsPhotoToRestaurant('kareem3@mail.com','restaurant2','photo8');
queries.UserAddsPhotoToRestaurant('kareem3@mail.com','restaurant2','photo9');