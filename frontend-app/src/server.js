var express = require('express');
var request = require('request');

var app = express();

app.get('/', function (req, res) {

	request(process.env.BACKEND_SERVICE+'/secret/', function (err, response, body) {
		if (err) {
			console.error (err);
			res.status(500).end();
		}
		res.send(body)
	});

});

app.listen(80, function(){
	console.log("The server is running at http://localhost:80");
});
