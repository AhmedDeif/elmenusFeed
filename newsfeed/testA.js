var should = require('should');
var assert = require('assert');
var queries = require('./queries.js');
var neo4j = require('neo4j');
var indexjs = require('./routes/index.js');
var db = new neo4j.GraphDatabase('http://localhost:7474');


//Sprint-2-US-6
describe('A Global Node can be created', function () {
 it('A Global node representing having all the new scores should be created', function (done) {
    test();
    function test(){
        db.query(queries.createGlobalNodeQuery, 
            params = {
                ep1: 1,
                ep2: 2,
                ep3: 3,
                ep5: 5,
                ep6: 6,
                ep7: 7,
                ep8: 8,
                ep9: 9,
                ep10: 10,
                ep11: 11
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                    verify();
                }
        });
   }
    function verify(){
        db.query('    match (s:Scores) where s.followsScore ={ep1} AND s.reviewScore ={ep2} AND s.likesDishScore ={ep3} AND s.addPhotoScore ={ep5} AND s.yum_yuckScore ={ep6} AND s.shareRestaurantScore ={ep7} AND s.shareDishScore ={ep8} AND s.sharePhotoScore= {ep9} AND s.favouritesScore ={ep10} AND  s.likeCuisineScore ={ep11} return s',         
            params = {
                ep1: 1,
                ep2: 2,
                ep3: 3,
                ep5: 5,
                ep6: 6,
                ep7: 7,
                ep8: 8,
                ep9: 9,
                ep10: 10,
                ep11: 11
            }, function(err, results) {
                if (err) {
                    console.error('Error');
                    throw err;
                } else {
                      var relationship = results.map(function(result) {
                    return result['s'];
                 });
                should.exist(relationship);
                done();
                }
        });
    }
 });
});