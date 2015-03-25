
/*
 * GET home page.
 */

var queries = require('../queries');

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.addDish = function(req, res) {
		queries.getRestaurants(function(restaurants) {
			res.render('add_dish', {rs:restaurants});
		});
	};