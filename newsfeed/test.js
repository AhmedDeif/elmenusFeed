var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');

queries.createUser('kareem1@mail.com');
queries.createUser('kareem2@mail.com');

queries.createCuisine('sushi');
queries.createCuisine('kabab');
queries.createCuisine('ma7ashi');






