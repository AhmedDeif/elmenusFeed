var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');



queries.createrLikeUserDish('kareem1@mail.com','dish1');
queries.createrLikeUserDish('kareem1@mail.com','dish2');
queries.createrLikeUserDish('kareem1@mail.com','dish3');


queries.createrLikeUserDish('kareem2@mail.com','dish4');
queries.createrLikeUserDish('kareem2@mail.com','dish5');
queries.createrLikeUserDish('kareem2@mail.com','dish6');
queries.createrLikeUserDish('kareem2@mail.com','dish7');

queries.createrLikeUserDish('kareem3@mail.com','dish4');
queries.createrLikeUserDish('kareem3@mail.com','dish5');
queries.createrLikeUserDish('kareem3@mail.com','dish10');
queries.createrLikeUserDish('kareem3@mail.com','dish11');


