var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');

queries.createResturant('restaurant1','sushi');
queries.createResturant('restaurant2','kabab');
queries.createResturant('restaurant3','kofta');


