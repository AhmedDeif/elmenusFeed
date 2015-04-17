/*
 * GET home page.
 */
var query = require('../queries');
exports.index = function(req, res) {
    res.render('index', {
        title: 'Express'
    })
}

exports.addDish = function(req, res) {
    query.getRestaurants(function(restaurants) {
        res.render('add_dish', {rs: restaurants});
    });
}

exports.Get_restaurant_info = function(req, res) {
    query.Get_restaurant_info(req.param("tagId"), function renderRes(myRes) {
        res.render('Get_restaurant_info', myRes);
    });
}

exports.signUp = function(req, res) {
    res.render('signup')
}

exports.newReview = function(req, res) {
    res.render('add_review');
}

exports.relationsView = function(req, res) {
		query.getRelations(function(relations) {
			res.render('relations_view', {rl:relations});
		});
}

exports.Get_relation_info = function(req, res){
	query.Get_relation_info(req.param("tagId"), req, res);
}

exports.Get_relation_info_cont = function(req, res, x){
 	res.render('Get_relation_info', x);
}

 exports.usersView = function(req, res) {
	query.getUsers(function(users) {
		res.render('users_view', {us:users});
	});
}

exports.Get_user_info = function(req, res){
	query.Get_user_info(req.param("tagId"), req, res);
}

exports.Get_user_info_cont = function(req, res, x){
 	res.render('Get_user_info', x);
}

exports.costChange = function(req, res) {
    res.render('costChange');
}
