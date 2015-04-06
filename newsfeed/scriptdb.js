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
/*
creating constraints in Neo4j database to speed up query processing 
*/
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

//------------------------------------------------------------------------------------
//create indices
/*
creating indices in Neo4j database to speed up query processing
and to speed up searching for records 
*/
function indexDishRes(){
  db.query("create index on :Dish(Restaurant);", params = {}, function (err, results) {
        if (err){  
                  throw err;
                }
        else {
          console.log('Index-Dish-Restaurant Done');
          indexUserEmail();
        }
    });
}

function indexUserEmail(){
  db.query("create index on :User(Email);", params = {}, function (err, results) {
        if (err){  
                  throw err;
                }
        else {
          console.log('Index-User-Mail Done');
          indexResName();
        }
    });
}

function indexResName(){
  db.query("create index on :Restaurant(Name);", params = {}, function (err, results) {
        if (err){  
                  throw err;
                }
        else {
          console.log('Index-Res-Name Done');
          indexDishName();
        }
    });
}

function indexDishName(){
  db.query("create index on :Dish(Name);", params = {}, function (err, results) {
        if (err){  
                  throw err;
                }
        else {
          console.log('Index-Dish-Name Done');
          restaurants();
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

//---------------------------------------------------------------------------------
//Create restaurants

function restaurants(){
    //check if the csv file exists if it exists delete
    //it as it isnt deleted mysql will crash
  if (fs.existsSync('C:/tmp/allRestaurants.csv')) {
    fs.unlinkSync('C:/tmp/allRestaurants.csv');
  }
    //selecting restaurant name from mysql database
    //from Restaurant table and putting it in a csv file
    //that each record of restaurant name  in one line 
    //and creating headers of Restaurant
  connection.query("select \'Restaurant\' UNION SELECT name_en AS Restaurant FROM restaurants INTO OUTFILE \'/tmp/allRestaurants.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    //creating restaurants with restaurant name in Neo4j database
    //by importing each record from CSV and saving each record
    //one by one in 'row' then extracting information from 
    //it by using headers (row.Restaurant)
          db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/allRestaurants.csv\" AS row MERGE (R:Restaurant {Name: row.Restaurant}) return R.Name limit 1;", params = {}, function (err, results) {
        if (err){  
                  throw err;
                }
        else {
          console.log('Restaurants Done');
        //calling next method to make code run synchronous
          dishes();
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
// dish-[]->restaurant




function dishesInRestaurants(){
    //check if the csv file exists if it exists delete
    //it as it isnt deleted mysql will crash
  if (fs.existsSync('C:/tmp/dishesRestaurant.csv')) {
    fs.unlinkSync('C:/tmp/dishesRestaurant.csv');
}
    //selecting restaurant name and dish name and linking them
    //by using inner joins between restaurants,menus and items
    // then creating headers of (Restaurant and Dish) and
    //putting it in a csv file that each 
    // record of restaurant name and dish name  in one line
  connection.query("select \'Restaurant\',\'Dish\' UNION select  r.name_en As Restaurant,d.name_en As Dish from restaurants r, items d,menus m where m.restaurant_id = r.id and d.menu_id=m.id INTO OUTFILE \'C:/tmp/dishesRestaurant.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    setTimeout(function(){
    //creating relations between restaurant and dishes [:Has] in Neo4j database
    //by matching restaurants' name and dishes name and restaurant name
    //(to gurantee that dishes are unique to restaurants) then 
    //importing each record from CSV and saving each record
    //one by one in 'row' then extracting information from 
    //it by using headers (row.Restaurant and row.Dish)
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/dishesRestaurant.csv\" AS row match (r:Restaurant {Name:row.Restaurant}) match (d:Dish {Name:row.Dish,Restaurant:row.Restaurant}) MERGE (r)-[:Has]->(d) return r limit 1;", params = {}, function (err, results) {
        if (err){  
                    throw err;
                }
        else {
          console.log('Dishes-Restaurants Done');
        //calling next method to make code run synchronous    
          reviewsOfRestaurants();
        }
    });

  },400);
          
     

}
  else{
    throw err;
    connection.end();
  }
});
}
//----------------------------------------------------------------------------------------
// add to favourite




function addToFavourite(){
if (fs.existsSync('C:/tmp/createFavoriteUserRestaurant.csv')) {
    fs.unlinkSync('C:/tmp/createFavoriteUserRestaurant.csv');
}
  connection.query("select \'User\',\'Restaurant\' UNION select u.email AS User,r.name_en AS Restaurant from restaurants r ,users u,user_favorites f where f.user_id = u.id and r.id = f.restaurant_id INTO OUTFILE \'/tmp/createFavoriteUserRestaurant.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    setTimeout(function(){
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createFavoriteUserRestaurant.csv\" AS row match (r:Restaurant {Name:row.Restaurant}) match (u:User {Email:row.User}) MERGE (u) -[:Favorite]-> (r) return r limit 1;", params = {}, function (err, results) {
        if (err){  
                    throw err;
                }
        else {
          console.log('User-Restaurants-Favourite Done');
          likeDish();
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

//----------------------------------------------------------------------------------------
// create dislike dish

function dislikeDish(){
    //check if the csv file exists if it exists delete
    //it as it isnt deleted mysql will crash
if (fs.existsSync('C:/tmp/createDislikeUserDishRestaurant.csv')) {
    fs.unlinkSync('C:/tmp/createDislikeUserDishRestaurant.csv');
}
    //selecting restaurant name and dish name and user name
    //then linking them by using inner joins
    // between restaurants,menus, users, items and item likes
    // and getting likes where items_likes.is_liked=0
    // then creating headers of (User,Dish and Restaurant) and
    //putting it in a csv file that each 
    // record of user,restaurant name and dish name  in one line
  connection.query("select \'User\',\'Dish\',\'Restaurant\' UNION select u.email As User,d.name_en AS Dish,r.name_en AS Restaurant from items d,items_likes l , restaurants r , users u,menus m where  d.id = l.item_id and u.id = l.user_id and l.user_id>=0 and d.menu_id=m.id and m.restaurant_id=r.id and l.is_liked=0 INTO OUTFILE \'C:/tmp/createDislikeUserDishRestaurant.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    setTimeout(function(){
    //creating relations between users and dishes of [:Dislike] in Neo4j database
    //by matching restaurants' name and dishes' name and users' name
    //then importing each record from CSV and saving each record
    //one by one in 'row' then extracting information from 
    //it by using headers (row.Restaurant and row.Dish)
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createDislikeUserDishRestaurant.csv\" AS row match (Restaurant {Name:row.Restaurant})-[:Has]->(d:Dish {Name:row.Dish}) match (u:User {Email:row.User}) MERGE (u) -[:Dislike]-> (d) return d limit 1;", params = {}, function (err, results) {
        if (err){  
                    throw err;
                }
        else {
          console.log('User-Dish-DISLike Done');
            //calling next method to make code run synchronous
          followUser();
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
// create follow user

function followUser(){
if (fs.existsSync('C:/tmp/createFollowUserUser.csv')) {
    fs.unlinkSync('C:/tmp/createFollowUserUser.csv');
}
  connection.query("select \'Follower\',\'Followee\' UNION select u1.email,u2.email from users u1,users u2,user_followers f where u1.id=f.user_id and u2.id=f.follower_id and u1.id<>u2.id INTO OUTFILE \'C:/tmp/createFollowUserUser.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    setTimeout(function(){
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createFollowUserUser.csv\" AS row match (u1:User {Email:row.Follower}) match (u2:User {Email:row.Followee}) MERGE (u1) -[:Follow]-> (u2)", params = {}, function (err, results) {
        if (err){  
                    throw err;
                }
        else {
          console.log('User-Follow-User Done');
          connection.end();  //Close mysql connection
        }
    });
  },400);
          
      

}
  else{
    throw err;
  }
});
}