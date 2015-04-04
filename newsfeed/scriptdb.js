//-----------------------------------------------------------------------------
// Create users


function users(){
  if (fs.existsSync('C:/tmp/createusers.csv')) {
    fs.unlinkSync('C:/tmp/createusers.csv');
}
  connection.query("select \'UserName\',\'UserEmail\'UNION SELECT distinct name,email FROM users INTO OUTFILE \'/tmp/createusers.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
          db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createusers.csv\" AS row MERGE (u:User {Name: row.UserName, Email: row.UserEmail}) return u limit 1;", params = {}, function (err, results) {
        if (err){  
                  console.error('Error');
                 
                }
        else {
          console.log('Users Done');
          dishesInRestaurants();
        }
    });

}
  else{
      throw err;
  }
});
}

//----------------------------------------------------------------------------------------
// create review

function reviewsOfRestaurants(){
  if (fs.existsSync('C:/tmp/createreviewUserRestaurant.csv')) {
    fs.unlinkSync('C:/tmp/createreviewUserRestaurant.csv');
}
  connection.query("select \'Restaurant\',\'User\',\'title\',\'body\' UNION select r.name_en AS Restaurant,u.email AS User,v.subject AS title,v.body AS body from restaurants r ,users u,reviews v where v.user_id = u.id and r.id = v.restaurant_id INTO OUTFILE \'C:/tmp/createreviewUserRestaurant.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    setTimeout(function(){
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createreviewUserRestaurant.csv\" AS row match (r:Restaurant {Name:row.Restaurant}) match (u:User {Email:row.User}) MERGE (u) -[:Review { title:row.title, body:row.body }]-> (r) return r limit 1;", params = {}, function (err, results) {
        if (err){  
                  throw err;
                }
        else {
          console.log('Reviews-Restaurants Done');
          addToFavourite();
        }
    });
  },400);
          
      

}
  else{
    throw err;
  }
});
}

//----------------------------------------------------------------------------------------
// create like


function likeDish(){
if (fs.existsSync('C:/tmp/createLikeUserDishRestaurant.csv')) {
    fs.unlinkSync('C:/tmp/createLikeUserDishRestaurant.csv');
}
  connection.query("select \'User\',\'Dish\',\'Restaurant\' UNION select u.email As User,d.name_en AS Dish,r.name_en AS Restaurant from items d,items_likes l , restaurants r , users u,menus m where  d.id = l.item_id and u.id = l.user_id and l.user_id>=0 and d.menu_id=m.id and m.restaurant_id=r.id and l.is_liked=1 INTO OUTFILE \'C:/tmp/createLikeUserDishRestaurant.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    setTimeout(function(){
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createLikeUserDishRestaurant.csv\" AS row match (Restaurant {Name:row.Restaurant})-[:Has]->(d:Dish {Name:row.Dish}) match (u:User {Email:row.User}) MERGE (u) -[:Like]-> (d) return d limit 1;", params = {}, function (err, results) {
        if (err){  
                    throw err;
                }
        else {
          console.log('User-Dish-Like Done');
          dislikeDish();
        }
    });
  },400);
          
}
  else{
    throw err;
  }
});
}