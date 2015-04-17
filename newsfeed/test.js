 var neo4j = require('neo4j');
 var queries = require('./queries.js');
/*
queries.createUser('User1');
queries.createUser('User2');
queries.createUser('User3');
queries.createUser('User4');
queries.createUser('User5');
queries.createUser('User6');
queries.createUser('User7');
queries.createUser('User8');
queries.createUser('User9');
queries.createUser('User10');
queries.createResturant('Rest1');
queries.createResturant('Rest2');
queries.createResturant('Rest3');
queries.createResturant('Rest4');
queries.createResturant('Rest5');
queries.createResturant('Rest6');
queries.createResturant('Rest7');
queries.createResturant('Rest8');
queries.createResturant('Rest9');
queries.createResturant('Rest10');
queries.createDish('Dish1');
queries.createDish('Dish2');
queries.createDish('Dish3');
queries.createDish('Dish4');
queries.createDish('Dish5');
queries.createDish('Dish6');
queries.createDish('Dish7');
queries.createDish('Dish8');
queries.createDish('Dish9');
queries.createDish('Dish10');
queries.createCuisine('Cuisine1');
queries.createCuisine('Cuisine2');
queries.createCuisine('Cuisine3');
queries.createCuisine('Cuisine4');
queries.createCuisine('Cuisine5');
queries.createCuisine('Cuisine6');
queries.createCuisine('Cuisine7');
queries.createCuisine('Cuisine8');
queries.createCuisine('Cuisine9');
queries.createCuisine('Cuisine10');
queries.createRelCuisineRestaurant('Rest1','Cuisine1');
queries.createRelCuisineRestaurant('Rest2','Cuisine2');
queries.createRelCuisineRestaurant('Rest3','Cuisine3');
queries.createRelCuisineRestaurant('Rest4','Cuisine4');
queries.createRelCuisineRestaurant('Rest5','Cuisine5');
queries.createRelCuisineRestaurant('Rest6','Cuisine6');
queries.createRelCuisineRestaurant('Rest7','Cuisine7');
queries.createRelCuisineRestaurant('Rest8','Cuisine8');
queries.createRelCuisineRestaurant('Rest9','Cuisine9');
queries.createRelCuisineRestaurant('Rest10','Cuisine10');
queries.createRelUserCuisine('User1','Cuisine1');
queries.createRelUserCuisine('User2','Cuisine2');
queries.createRelUserCuisine('User3','Cuisine3');
queries.createRelUserCuisine('User4','Cuisine4');
queries.createRelUserCuisine('User4','Cuisine1');
queries.createRelUserCuisine('User5','Cuisine1');
queries.createRelUserCuisine('User6','Cuisine3');
queries.createRelUserCuisine('User7','Cuisine9');

queries.createRelUserResCuisines('User1', 'Rest1');
queries.createRelUserResCuisines('User1', 'Rest2');
queries.createRelUserResCuisines('User3', 'Rest3');
queries.createRelUserResCuisines('User4', 'Rest4');
queries.createRelUserResCuisines('User5', 'Rest5');
queries.createRelUserResCuisines('User6', 'Rest6');




queries.addDishToRestaurant('Dish1', 'Rest1');
queries.addDishToRestaurant('Dish2', 'Rest2');
queries.addDishToRestaurant('Dish3', 'Rest3');
queries.addDishToRestaurant('Dish4', 'Rest4');
queries.addDishToRestaurant('Dish5', 'Rest5');
queries.addDishToRestaurant('Dish6', 'Rest6');
queries.addDishToRestaurant('Dish7', 'Rest7');
queries.addDishToRestaurant('Dish8', 'Rest8');
queries.addDishToRestaurant('Dish9', 'Rest9');
queries.addDishToRestaurant('Dish10', 'Rest10');
queries.UserAddsPhotoToRestaurant ('User1', 'Rest1', 'Photo1');
queries.UserAddsPhotoToRestaurant ('User1', 'Rest2', 'Photo2');
queries.UserAddsPhotoToRestaurant ('User2', 'Rest3', 'Photo3');
queries.UserAddsPhotoToRestaurant ('User2', 'Rest4', 'Photo4');
queries.UserAddsPhotoToRestaurant ('User3', 'Rest5', 'Photo5');
queries.UserAddsPhotoToRestaurant ('User3', 'Rest6', 'Photo6');
queries.UserAddsPhotoToRestaurant ('User4', 'Rest7', 'Photo7');
queries.UserAddsPhotoToRestaurant ('User5', 'Rest8', 'Photo8');
queries.UserAddsPhotoToRestaurant ('User6', 'Rest9', 'Photo9');
queries.UserAddsPhotoToRestaurant ('User6', 'Rest10', 'Photo10');
queries.UserAddsPhotoToRestaurant ('User7', 'Rest1', 'Photo11');
queries.UserAddsPhotoToRestaurant ('User8', 'Rest1', 'Photo12');


queries.createrLikeUserDish('User1', 'Dish1');
queries.createrLikeUserDish('User2', 'Dish2');
queries.createrLikeUserDish('User3', 'Dish3');
queries.createrLikeUserDish('User4', 'Dish4');
queries.createrLikeUserDish('User5', 'Dish5');
queries.createrLikeUserDish('User6', 'Dish6');
queries.createrLikeUserDish('User7', 'Dish7');
queries.createrLikeUserDish('User8', 'Dish8');
queries.createrLikeUserDish('User1', 'Dish2');
queries.createrLikeUserDish('User1', 'Dish3');
queries.createrLikeUserDish('User2', 'Dish1');
queries.createrLikeUserDish('User2', 'Dish3');
queries.createrDisLikeUserDish('User9','Dish9');
queries.createrDisLikeUserDish('User10','Dish10');


queries.createFollowUser('User1','User2');
queries.createFollowUser('User3','User4');
queries.createFollowUser('User5','User6');
queries.createFollowUser('User7','User8');
queries.createFollowUser('User9','User10');
queries.createFollowUser('User1','User3');
queries.createFollowUser('User1','User4');
queries.createFollowUser('User1','User5');
queries.createFollowUser('User4','User10');
queries.createFollowUser('User5','User2');
queries.createFollowUser('User7','User2');





queries.UserAddPhotoYums('User1', 'Photo1');
queries.UserAddPhotoYums('User1', 'Photo2');
queries.UserAddPhotoYums('User1', 'Photo3');
queries.UserAddPhotoYums('User1', 'Photo5');

queries.UserAddPhotoYums('User3', 'Photo1');
queries.UserAddPhotoYums('User3', 'Photo2');
queries.UserAddPhotoYums('User3', 'Photo3');

queries.UserAddPhotoYums('User1', 'Photo6');
queries.UserAddPhotoYums('User2', 'Photo1');
queries.UserAddPhotoYums('User2', 'Photo3');
queries.UserAddPhotoYums('User2', 'Photo5');
queries.UserAddPhotoYucks('User2', 'Photo12');
queries.UserAddPhotoYucks('User2', 'Photo11');
queries.UserAddPhotoYucks('User4', 'Photo12');
queries.UserAddPhotoYucks('User4', 'Photo11');
queries.UserAddPhotoYums('User3', 'Photo12');
queries.UserAddPhotoYums('User4', 'Photo10');
queries.UserAddPhotoYucks('User5', 'Photo9');
queries.UserSharesRestaurant('User1','Rest1');
queries.UserSharesRestaurant('User2','Rest3');
queries.UserSharesPhoto('User3','Photo3');
queries.UserSharesPhoto('User4','Photo3');
queries.UserSharesPhoto('User5','Photo5');
queries.UserSharesDish('User5','Dish5');
queries.UserSharesDish('User6','Dish6');
queries.UserSharesDish('User7','Dish7');
*/

/*

queries.deleterFollowUserUser('User1','User2');
queries.deleterFollowUserUser('User3','User4');
queries.deleterFollowUserUser('User5','User6');
queries.deleterFollowUserUser('User7','User8');
queries.deleterFollowUserUser('User9','User10');
queries.deleterFollowUserUser('User1','User3');
queries.deleterFollowUserUser('User1','User4');
queries.deleterFollowUserUser('User1','User5');
queries.deleterFollowUserUser('User4','User10');
queries.deleterFollowUserUser('User5','User2');
queries.deleterFollowUserUser('User7','User2');




queries.createFollowUser('User5','User9');
queries.createFollowUser('User6','User9');
queries.createFollowUser('User4','User9');
queries.createFollowUser('User7','User9');
queries.createFollowUser('User5','User8');
queries.createFollowUser('User8','User3');



queries.createFollowUser('User3','User5');
queries.createFollowUser('User3','User4');

queries.createFollowUser('User6','User4');
queries.createFollowUser('User6','User5');

queries.createFollowUser('User6','User3');
*/