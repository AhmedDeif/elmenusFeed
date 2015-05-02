var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');

queries.createrLikeUserDish('kareem1@mail.com','dish3');

queries.UserAddPhotoYums('kareem1@mail.com','photo4');
queries.createrLikeUserDish('kareem1@mail.com','dish10');

queries.createrLikeUserDish('kareem1@mail.com','dish11');
queries.createrLikeUserDish('kareem1@mail.com','dish12');