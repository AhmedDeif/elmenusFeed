var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'CALLOFDUTY6',
  database : 'test1'
});


connection.connect();
// To delete old CSVs
var fs = require('fs');  

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
  db.query("create index on :Dish(restaurant);", params = {}, function (err, results) {
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
  db.query("create index on :User(email);", params = {}, function (err, results) {
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
  db.query("create index on :Restaurant(name);", params = {}, function (err, results) {
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
  db.query("create index on :Dish(dish_name);", params = {}, function (err, results) {
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
    //check if the csv file exists if it exists delete
    //it as it isnt deleted mysql will crash
  if (fs.existsSync('C:/tmp/createusers.csv')) {
    fs.unlinkSync('C:/tmp/createusers.csv');
}
  //selecting users(name and email) from mysql database
    //from users table and putting it in a csv file
    //that each record of users(name and email) in one line 
    //and creating headers of users
  connection.query("select \'UserName\',\'UserEmail\'UNION SELECT distinct name,email FROM users INTO OUTFILE \'/tmp/createusers.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
  //creating users with users(name and email) in Neo4j database
    //by importing each record from CSV and saving each record
    //one by one in 'row' then extracting information from 
    //it by using headers (row.UserName) and (row.UserEmail)
          db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createusers.csv\" AS row MERGE (u:User {name: row.UserName, email: row.UserEmail}) return u limit 1;", params = {}, function (err, results) {
        if (err){  
                  console.error('Error');
                 
                }
        else {
          console.log('Users Done');
      //calling next method to make code run synchronous
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
          db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/allRestaurants.csv\" AS row MERGE (R:Restaurant {name: row.Restaurant}) return R.name limit 1;", params = {}, function (err, results) {
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
    //check if the csv file exists if it exists delete
    //it as it isnt deleted mysql will crash
  if (fs.existsSync('C:/tmp/allDishes.csv')) {
    fs.unlinkSync('C:/tmp/allDishes.csv');
}
    //selecting dish's name and its restaurant from mysql database
    //from Items table and restaurants table and putting it in a csv file
    //that each record of dish name and restaurant name  in one line 
    //and creating headers of Dish and Restaurant
  connection.query("select \'Dish\',\'Restaurant\' UNION SELECT d.name_en As Dish , r.name_en FROM restaurants r, items d,menus m where d.menu_id = m.id and m.restaurant_id = r.id INTO OUTFILE \'C:/tmp/allDishes.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    //creating dishes with dish name and restaurant name in Neo4j database
    //by importing each record from CSV and saving each record
    //one by one in 'row' then extracting information from 
    //it by using headers (row.Restaurant and row.Dish)
          db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/allDishes.csv\" AS row MERGE (d:Dish {dish_name: row.Dish,restaurant: row.Restaurant}) return d limit 1 ;", params = {}, function (err, results) {
        if (err){  
                console.error('Error'); 
                }
        else {

          console.log('Dishes Done');
          //calling next method to make code run synchronous
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
    //check if the csv file exists if it exists delete
    //it as it isnt deleted mysql will crash
  if (fs.existsSync('C:/tmp/createreviewUserRestaurant.csv')) {
    fs.unlinkSync('C:/tmp/createreviewUserRestaurant.csv');
}
    //selecting reviews on restaurants from mysql database
    //from restaurants, users, reviews tables and putting them in a csv file
    //that each record of reviews in one line 
    //and creating headers of reviews
  connection.query("select \'Restaurant\',\'User\', \'title\', \'body\', \'created_at\' UNION select r.name_en AS Restaurant,u.email AS User,v.subject AS title, v.body AS body, v.created_at AS created_at from restaurants r ,users u,reviews v where v.user_id = u.id and r.id = v.restaurant_id INTO OUTFILE \'C:/tmp/createreviewUserRestaurant.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
  //creating reviews with title and body in Neo4j database
    //by importing each record from CSV and saving each record
    //one by one in 'row' then extracting information from 
    //it by using headers (row.title)(row.body)
  //and finding the reviewer and the restaurant to insert the review by  (row.Restaurant)(row.User)
    setTimeout(function(){
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createreviewUserRestaurant.csv\" AS row match (r:Restaurant {name:row.Restaurant}) match (u:User {email:row.User}) MERGE (u) -[:Review { title:row.title, body:row.body, created_at:row.created_at }]-> (r) return r limit 1;", params = {}, function (err, results) {
        if (err){  
                  throw err;
                }
        else {
          console.log('Reviews-Restaurants Done');
      //calling next method to make code run synchronous
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
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/dishesRestaurant.csv\" AS row match (r:Restaurant {name:row.Restaurant}) match (d:Dish {dish_name:row.Dish,restaurant:row.Restaurant}) MERGE (r)-[:HAS]->(d) return r limit 1;", params = {}, function (err, results) {
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
    //check if the csv file exists if it exists delete
    //it as it isnt deleted mysql will crash
if (fs.existsSync('C:/tmp/createFavoriteUserRestaurant.csv')) {
    fs.unlinkSync('C:/tmp/createFavoriteUserRestaurant.csv');
}
    //selecting restaurant name and user email and linking them
    //by using inner joins between users,user_favorites and restaurants
    // then creating headers of (Restaurant and User) and
    //putting it in a csv file that each 
    // record of restaurant name and user email  in one line
  connection.query("select \'User\',\'Restaurant\', \'created_at\' UNION select u.email AS User,r.name_en AS Restaurant, f.created_at AS created_at from restaurants r ,users u,user_favorites f where f.user_id = u.id and r.id = f.restaurant_id INTO OUTFILE \'/tmp/createFavoriteUserRestaurant.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    setTimeout(function(){
      //creating relations between restaurant and user [:Favorite] in Neo4j database
      //by matching restaurants' name and user's mails then 
      //importing each record from CSV and saving each record
      //one by one in 'row' then extracting information from 
      //it by using headers (row.Restaurant and row.User)
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createFavoriteUserRestaurant.csv\" AS row match (r:Restaurant {name:row.Restaurant}) match (u:User {email:row.User}) MERGE (u) -[:FAVORITES{created_at:row.created_at}]-> (r) return r limit 1;", params = {}, function (err, results) {
        if (err){  
                    throw err;
                }
        else {
          console.log('User-Restaurants-Favourite Done');
          //calling next method to make code run synchronous 
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
    //check if the csv file exists if it exists delete
    //it as it isnt deleted mysql will crash
if (fs.existsSync('C:/tmp/createLikeUserDishRestaurant.csv')) {
    fs.unlinkSync('C:/tmp/createLikeUserDishRestaurant.csv');
}
    //selecting likes on dishes from mysql database
    //from items,items_likes, restaurants, users, menus tables and putting it in a csv file
    //that each record of likes in one line 
    //and creating headers of likes
  connection.query("select \'User\',\'Dish\',\'Restaurant\', \'created_at\' UNION select u.email As User,d.name_en AS Dish,r.name_en AS Restaurant, l.created_at AS created_at from items d,items_likes l , restaurants r , users u,menus m where  d.id = l.item_id and u.id = l.user_id and l.user_id>=0 and d.menu_id=m.id and m.restaurant_id=r.id and l.is_liked=1 INTO OUTFILE \'C:/tmp/createLikeUserDishRestaurant.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    //creating likes relationship in Neo4j database
    //by importing each record from CSV and saving each record
    //one by one in 'row' then extracting information from 
    //it by using headers (row.Restaurant)(row.Dish)(row.User)
  //where these headers are used to find the Restaurant,Dish and the
  //User for the user to be able to like that dish in the restaurant.
    setTimeout(function(){
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createLikeUserDishRestaurant.csv\" AS row match (Restaurant {name:row.Restaurant})-[:HAS]->(d:Dish {dish_name:row.Dish}) match (u:User {email:row.User}) MERGE (u) -[:LIKES_DISH{likes:TRUE, created_at:row.created_at}]-> (d) return d limit 1;", params = {}, function (err, results) {
        if (err){  
                    throw err;
                }
        else {
          console.log('User-Dish-Like Done');
      //calling next method to make code run synchronous
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
  connection.query("select \'User\',\'Dish\',\'Restaurant\',\'Time\' UNION select u.email As User,d.name_en AS Dish,r.name_en AS Restaurant,l.created_at As \'Time\' from items d,items_likes l , restaurants r , users u,menus m where  d.id = l.item_id and u.id = l.user_id and l.user_id>=0 and d.menu_id=m.id and m.restaurant_id=r.id and l.is_liked=0 INTO OUTFILE \'C:/tmp/createDislikeUserDishRestaurant.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    setTimeout(function(){
    //creating relations between users and dishes of [:Dislike] in Neo4j database
    //by matching restaurants' name and dishes' name and users' name
    //then importing each record from CSV and saving each record
    //one by one in 'row' then extracting information from 
    //it by using headers (row.Restaurant and row.Dish)
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createDislikeUserDishRestaurant.csv\" AS row match (Restaurant {name:row.Restaurant})-[:HAS]->(d:Dish {dish_name:row.Dish}) match (u:User {email:row.User}) MERGE (u) -[:LIKES_DISH{likes:FALSE,created_at:row.Time}]-> (d) return d limit 1;", params = {}, function (err, results) {
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
    //check if the csv file exists if it exists delete
    //it as it isnt deleted mysql will crash
if (fs.existsSync('C:/tmp/createFollowUserUser.csv')) {
    fs.unlinkSync('C:/tmp/createFollowUserUser.csv');
}
    //selecting follower's email and followee's email
    //then linking them by using inner joins
    // between users and followers tables
    // then creating headers of (Follower and Followee) and
    //putting it in a csv file that each 
    // record of follower's email and followee's email  in one line
  connection.query("select \'Follower\',\'Followee\',\'Time\' UNION select u1.email,u2.email,f.created_at from users u1,users u2,user_followers f where u1.id=f.user_id and u2.id=f.follower_id and u1.id<>u2.id INTO OUTFILE \'C:/tmp/createFollowUserUser.csv\' FIELDS TERMINATED BY \',\' ENCLOSED BY \'\"\' LINES TERMINATED BY \'\n\';"
  , function(err, rows, fields) {
  if (!err){
    setTimeout(function(){
      //creating relations between follower and followee of [:Follow] in Neo4j database
      //by matching follower's email and followee's email
      //then importing each record from CSV and saving each record
      //one by one in 'row' then extracting information from 
      //it by using headers (row.Follower and row.Followee)
      db.query("USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM \"file:///C:/tmp/createFollowUserUser.csv\" AS row match (u1:User {email:row.Follower}) match (u2:User {email:row.Followee}) MERGE (u1) -[:FOLLOWS{created_at:row.Time,score:4,totalScore:0}]-> (u2)", params = {}, function (err, results) {
        if (err){  
                    throw err;
                }
        else {
          console.log('User-Follow-User Done');
          //Close mysql connection
          connection.end();  
        }
    });
  },400);
          
      

}
  else{
    throw err;
  }
});
}

