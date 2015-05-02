var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');

queries.UserAddPhotoYums('kareem1@mail.com','photo1');
queries.createrLikeUserDish('kareem1@mail.com','dish1');

queries.UserAddPhotoYums('kareem1@mail.com','photo2');
queries.createrLikeUserDish('kareem1@mail.com','dish2');

queries.UserAddPhotoYums('kareem1@mail.com','photo3');

queries.createrLikeUserDish('kareem1@mail.com','dish3');



