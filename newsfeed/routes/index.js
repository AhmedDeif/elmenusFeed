
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.Get_restaurant_info = function(req, res){
  res.render('Get_restaurant_info')
};