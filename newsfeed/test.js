var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');

queries.createUser('kareem1@mail.com');
queries.createUser('kareem2@mail.com');

queries.createCuisine('sushi');
queries.createCuisine('kabab');
queries.createCuisine('ma7ashi');

queries.createDish('dish1');
queries.createDish('dish2');
queries.createDish('dish3');
queries.createDish('dish4');
queries.createDish('dish5');
queries.createDish('dish6');
queries.createDish('dish7');
queries.createDish('dish8');
queries.createDish('dish9');
queries.createDish('dish10');
queries.createDish('dish11');
queries.createDish('dish12');
queries.createDish('dish13');






