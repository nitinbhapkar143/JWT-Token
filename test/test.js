var request = require('supertest');
var app = require("../myApp/app.js");
var validToken = '';

describe('Login route', function() {

  var unamePass = {
	"username" : "Nitin",
	"password" : "test1234"
	};
  var invalidUname = {
	"username" : "",
	"password" : "test1234"
	};
  var invalidPass = {
	"username" : "Nitin",
	"password" : ""
	};
   var invalidUnamePass = {
	"username" : "",
	"password" : ""
	};

it('should return a 400 status code since usename is empty', function(done) {
    request(app)
      .post('/login')
      .send(invalidUname)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400,done)
  });

it('should return a 400 status code since password is empty', function(done) {
    request(app)
      .post('/login')
      .send(invalidPass)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400,done)
  });

it('should return a 400 status code since username and password is empty', function(done) {
    request(app)
      .post('/login')
      .send(invalidUnamePass)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400,done)
  });

it('should return a JWT token with 200 status code', function(done) {
    request(app)
      .post('/login')
      .send(unamePass)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        validToken = result.token;
        done();
      });
  });

});



describe('Patch JSON route', function() {
  var invalidToken = 'Hello this is invalid token';
  var validObj = {
	"jsonObj" : 
		{ 
		"firstName":"Albert", 
		"contactDetails" : { 
			"phoneNumbers" : [ ] } 
		},
		"patchObj" : [
	   { "op" :"replace", "path" :"/firstName", "value" :"Joachim" },
	   { "op" :"add", "path" :"/lastName", "value" :"Wester" },
	   { "op" :"add", "path" :"/contactDetails/phoneNumbers/0", "value" :{ "number" :"555-123" }  }
	   ]
	};

  var invalidObj = {
	"jsonObj" : 
		{ 
		"firstName":"Albert", 
		"contactDetails" : { 
			"phoneNumbers" : [ ] } 
		},
		"patchObj" : [
	   { "op" :"replace", "path" :"/firstName", "value" :"Joachim" },
	   { "op" :"replace", "path" :"/lastName", "value" :"Wester" },
	   { "op" :"add", "path" :"/contactDetails/phoneNumbers/0", "value" :{ "number" :"555-123" }  }
	   ]
	};

  it('should return status 401 since no token was sent', function(done) {
    request(app)
      .post('/getpatchedjson')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(401, done);
  });

    it('should return status 401 since invalid token was sent', function(done) {
    request(app)
      .post('/getpatchedjson')
      .send(validObj)
      .set('Authorization', 'Bearer ' + invalidToken)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(401, done);
  }); 

   it('should return status 400 since invalid object was sent', function(done) {
    request(app)
      .post('/getpatchedjson')
      .send(invalidObj)
      .set('Authorization', 'Bearer ' + validToken)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400, done);
  });

    it('should return status 200 and pached json since valid token was sent', function(done) {
    request(app)
      .post('/getpatchedjson')
      .send(validObj)
      .set('Authorization', 'Bearer ' + validToken)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .expect({
		  "firstName": "Joachim",
		  "contactDetails": {
		    "phoneNumbers": [
		      {
		        "number": "555-123"
		      }
		    ]
		  },
		  "lastName": "Wester"
	  }, done);
  });

});


describe('Thumbnail route', function() {
  this.timeout(15000);
  var invalidToken = 'Hello!!! this is invalid token';
  var validURL = {
	"url" : "https://www.google.com/images/srpr/logo3w.png"
	};
  var invalidURL = {
	"url" : "https://www.google.com/images/srpr/logo"
	};

  it('should return status 401 since no token was sent', function(done) {
    request(app)
      .post('/getthumbnail')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(401, done);
  });

  it('should return status 401 since invalid token was sent', function(done) {
    request(app)
      .post('/getthumbnail')
      .send(validURL)
      .set('Authorization', 'Bearer ' + invalidToken)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(401, done);
  }); 

  it('should return status 404 since invalid url was sent with valid token', function(done) {
    request(app)
      .post('/getthumbnail')
      .send(invalidURL)
      .set('Authorization', 'Bearer ' + validToken)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404, done);
  });

  it('should return status 201 and thubnail URL since valid token was sent with valid token', function(done) {
    request(app)
      .post('/getthumbnail')
      .send(validURL)
      .set('Authorization', 'Bearer ' + validToken)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201, done);
  });


});