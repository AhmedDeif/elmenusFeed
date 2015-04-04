var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'neo4j2'
});

connection.connect();
var fs = require('fs');  // To delete old CSVs

uniqueUser(); 


//---------------------------------------------------------------------------------
//Create constrains

function uniqueUser(){
  db.query("CREATE CONSTRAINT ON (x:User) ASSERT x.id IS UNIQUE;", params = {}, function (err, results) {
        if (err){  
                  throw err;
                }
        else {
          console.log('CONSTRAINT-User Done');
          uniqueRestaurant();
        }
    });
}

function uniqueRestaurant(){
  db.query("CREATE CONSTRAINT ON (x:Restaurant) ASSERT x.id IS UNIQUE;", params = {}, function (err, results) {
        if (err){  
                  throw err;
                }
        else {
          console.log('CONSTRAINT-Restaurant Done');
          indexDishRes();
        }
    });
}

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

//-------------------------------------------------------
//create dish


function dishes(){
  if (fs.existsSync('C:/tmp/allDishes.csv')) {
    fs.unlinkSync('C:/tmp/allDishes.csv');
}

  connection.query("select \'Dish\',\'Restaurant\' UNION SELECT d.name_en As Dish , r.name_en FROM restaurants r, items d,menus m where d.menu_id = m.id and m.restaurant_id = r.id INTO OUTFILE \'C:/tmp/allDishes.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
          db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/allDishes.csv\" AS row MERGE (d:Dish {Name: row.Dish,Restaurant: row.Restaurant}) return d limit 1 ;", params = {}, function (err, results) {
        if (err){  
                console.error('Error'); 
                }
        else {

          console.log('Dishes Done');
          users();
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