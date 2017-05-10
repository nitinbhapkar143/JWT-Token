var fs = require('fs');
var request = require('request');
var path = require('path');
var lwip = require('lwip');
var rn = require('random-number');


exports.getThumbnail = function(req, res) {
	var options = {
  		min:  1,
		max:  100,
		integer: true
		};
	var mainobj = req.body;
	var oldPath = mainobj.url;
	var imPath = path.resolve(__dirname + '/../images/' + path.basename(oldPath));
	var newPath = path.resolve(__dirname + '/../images/thumb-of-' + path.basename(oldPath));
	mainobj.url = newPath;
	download(oldPath, imPath, res, function(){
		try{
	  	lwip.open(imPath, function(err, image){
	  		if(err) {
	  			res.setHeader('Content-Type', 'application/json');
	  			return res.status(404).send(JSON.stringify({error: 'Invalid URL'}));
	  		}
	  		else{
	  			image.resize(50, function(err, resImage){
		  			resImage.writeFile(newPath, function(err){
		  				res.setHeader('Content-Type', 'application/json');
		  				return res.status(201).send(JSON.stringify(mainobj));
	    			});
	  			});
	  		}
	  		
	  	});
	  }
	  catch(err){
	  	res.setHeader('Content-Type', 'application/json');
	  	return res.status(404).send(JSON.stringify({error: 'Invalid URL'}));
	  }

	});
}

var download = function(uri, filename, res, callback){
  request.head(uri, function(err){
  	if(err){
  		res.setHeader('Content-Type', 'application/json');
  		return res.status(400).send(JSON.stringify({error: 'Connection Problem'}));
 	}
 	else{
    	request(uri).pipe(fs.createWriteStream(filename))
	      .on('close', callback)
	      .on('error', function(err){
	      res.setHeader('Content-Type', 'application/json');
	      return res.status(404).send(JSON.stringify({error: 'Error while downoading'}));
    	});	
  	}
  });
};


