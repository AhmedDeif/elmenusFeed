
/*
 * GET home page.
 */

 var query = require('../queries');
 
exports.index = function(req, res){

  res.render('index', { title: 'Express' })
};

exports.Get_restaurant_info = function(req, res){
	var x = query.Get_restaurant_info(req.param("tagId"));
	res.render('Get_restaurant_info', x);
};

exports.newDish = function(req, res){
	res.render('add_dish')
};

<<<<<<< HEAD


exports.signUp = function(req, res){
	res.render('signup')
};

=======
exports.signUp = function(req, res){
	res.render('signup')
};

>>>>>>> bd6c6415b68819852553c1d9f54cddba894f58dc
exports.newReview = function(req, res){
	res.render('add_review')
};


