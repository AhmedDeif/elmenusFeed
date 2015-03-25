
/*
 * GET home page.
 */

 var query = require('../queries');
 
exports.index = function(req, res){
<<<<<<< HEAD
  res.render('index', { title: 'Express' })
};

exports.Get_restaurant_info = function(req, res){
	var x = query.Get_restaurant_info(req.param("tagId"));
	res.render('Get_restaurant_info', x);
};
=======
  res.render('index', { title: 'Lock-n-Code' })
};

exports.newDish = function(req, res){
	res.render('add_dish')
};

exports.signUp = function(req, res){
	res.render('signup')
};
exports.newReview = function(req, res){
	res.render('add_review')
};

>>>>>>> master
