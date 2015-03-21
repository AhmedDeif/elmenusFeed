
/*
 * GET home page.
 */

 var query = require('../queries');
 
exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.Get_restaurant_info = function(req, res){
	var x = query.Get_restaurant_info('Peking');
	res.render('Get_restaurant_info', x);
};