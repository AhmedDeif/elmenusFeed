
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var neo4j = require('neo4j');
var queries = require('./queries.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/Get_restaurant_info', routes.Get_restaurant_info);


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
