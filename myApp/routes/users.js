var path = require('path');

exports.login = function(req ,res, next){
    var username=req.body.username;
    var password=req.body.password;
    if(username && password){
      	next();
    }
    else{
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).send(JSON.stringify({error : 'Invalid username or password'}));
    }   
}
