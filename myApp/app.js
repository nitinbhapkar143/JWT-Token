var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var user = require('./routes/users');
var thumbnail = require('./routes/thumbnail');
var patch = require('./routes/jsonpatch');
var app = express();
var jwtSecret = 'nopwstfulmopwww6446@12';
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressJwt({ secret: jwtSecret }).unless({ path: ['/login']}));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(401).send(JSON.stringify({error: 'Invalid token'}));
  }
});
app.post('/login',user.login,function(req,res){
    var token = jwt.sign({username: req.body.username}, jwtSecret);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({token: token}));
});
app.post('/getthumbnail',thumbnail.getThumbnail);
app.post('/getpatchedjson',patch.getPatchedJSON);
var port = process.env.PORT || '8080';
var server = app.listen(port, function(req,res){
    console.log("Catch the action at http://localhost:" + port);
});
module.exports = app;
