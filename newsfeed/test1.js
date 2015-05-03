var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');

queries.createCuisine('sushi');
queries.createCuisine('kabab');
queries.createCuisine('ma7ashi');



queries.createFollowUser('kareem1@mail.com','kareem2@mail.com');
queries.createFollowUser('kareem2@mail.com','kareem1@mail.com');
queries.createFollowUser('kareem1@mail.com','kareem3@mail.com');
