var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var queries = require('./queries.js');

queries.createResturant('restaurant1','sushi');
queries.createResturant('restaurant2','kabab');
queries.createResturant('restaurant3','ma7ashi');

queries.createFollowUser('kareem1@mail.com','kareem2@mail.com');
queries.createFollowUser('kareem2@mail.com','kareem1@mail.com');
