var app = require('../app.js');
var request = require('supertest')
var expect = require('chai').expect;

/** Tests for Sprint#-0-US-4 */
describe('Add Review View', function() {
	it("should get /add_review", function(done) {
		request(app.app)
			.get('/add_review')
			.expect('Content-Type', 'text/html; charset=utf-8')
			.expect(200, done);
	})
});

describe('Add Review Form Submit', function() {
	it("should post /new_review", function(done) {
		request(app.app)
			.post('/new_review')
			.type('form')
			.send({ body: { email: 'test@email.test', restaurantName: 'testRest'
				, reviewTitle:'test review', reviewBody: 'This is a test review' } })
			.expect(302, done);
	})
})