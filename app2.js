var express = require('express');
var app = express();
var request = require('request');
var nextbusjs = require('nextbusjs');
var rutgers = nextbusjs.client();
var b;

request('https://rumobile.rutgers.edu/0.1/rutgersrouteconfig.txt', function (err, data, body) {
	if (err) return console.dir(error)
	rutgers.setAgencyCache((JSON.parse(body)), 'rutgers');

app.get('/nearby', 
	function(req, res)
	{
		var lat = req.query['lat'];
		var lon = req.query['lon'];

		var stops = rutgers.closestStops(lat, lon, 8, 12);

		var stops2 = [];
		for(i in stops)
		{
			stops2.push(i);
		}

		res.send(200, stops2);
	}
);

app.get('/buses', 
	function(req, res)
	{
		/* query for bus stops and parse */
		var query = req.query['stop'];
		//console.log(query);

		/* let user selection location */
		rutgers.stopPredict(query , null, function (error, data) {
			
			if (error) {
				console.dir(error);
				res.send(500);
				return;
			}
			//console.log(data);

			var buses = [];
			for(i in data)
			{
				if(data[i].predictions != null)
				{
					buses.push({ title: data[i].title ,seconds: data[i].predictions[0].seconds });
				}
			}
			res.send(200, buses);
 		}, 'both');		
	}
);

app.listen(3000);
console.log('Listening on port 3000');
});





