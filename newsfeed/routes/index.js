
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

exports.signUp = function(req, res){
	res.render('signup')
};

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

