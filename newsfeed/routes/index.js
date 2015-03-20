
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.newDish = function(req, res){
	res.render('add_dish')
};

<<<<<<< HEAD
exports.signUp = function(req, res){
	res.render('signup')
};
=======
exports.newReview = function(req, res){
	res.render('add_review')
};

>>>>>>> reviewRestaurant
