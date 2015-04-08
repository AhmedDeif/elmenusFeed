
/*
 * GET home page.
 */

 var query = require('../queries');
 
exports.index = function(req, res){

  res.render('index', { title: 'Express' })
};

exports.Get_restaurant_info = function(req, res){
	query.Get_restaurant_info(req.param("tagId"),function renderRes(myRes){res.render('Get_restaurant_info', myRes);});
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

exports.relationsView = function(req, res) {
		query.getRelations(function(relations) {
			res.render('relations_view', {rl:relations});
		});
	};

exports.Get_relation_info = function(req, res){
	query.Get_relation_info(req.param("tagId"), req, res);
};

exports.Get_relation_info_cont = function(req, res, x){
 	res.render('Get_relation_info', x);
 };

