var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');


exports.createResturant  = function (name) {
    db.query("CREATE (:Restaurant { name:{np} })", params = {np:name}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
        else console.log("Done");
    });
}

var data1;
exports.Get_restaurant_info  = function (name) {
    db.query("match (Restaurant{name:{na}}) <-[out:Review]- () return out", params = {na:name}, function (err, results) {
        if (err){  console.log('Error');
                 throw err;
                }
				
			data1 = results.map(function (result) {
            return result['out'];
			});
			
         console.log(data1[0]._data.data);
    });
	
	return data1[0]._data.data;
}
