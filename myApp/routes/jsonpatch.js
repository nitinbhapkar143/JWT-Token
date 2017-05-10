var jsonpatch = require('json-patch');

exports.getPatchedJSON = function(req, res) {
	var jsonObj = req.body.jsonObj;
	var patchObj  =  req.body.patchObj ;
	try{
		jsonpatch.apply(jsonObj, patchObj);
		res.setHeader('Content-Type', 'application/json');
		res.status(200).send(JSON.stringify(jsonObj));
	}
	catch(err){
	res.setHeader('Content-Type', 'application/json');
	res.status(400).send(JSON.stringify({error : err.name}));
	}
}