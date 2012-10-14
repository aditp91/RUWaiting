var express = require('express');
var app = express();
var request = require('request');
var nextbusjs = require('nextbusjs');
var rutgers = nextbusjs.client();

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

	app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({
    dumpExceptions: true, 
    showStack: true
  }));
  app.use(app.router);


  next();
});

app.get('/youtube', function(req, res) {
	var request = require('request');
	var query = req.query['category'] || 'cats';
	var time_remaining = req.query['time'] || '300';
	
	if (time_remaining < 240)
		duration = 'short';
	else if (time_remaining <= 1200)
		duration = 'medium';
	else
		duration = 'long';
	
	var req_url = 'https://gdata.youtube.com/feeds/api/videos?alt=json&q='+query+'&duration='+duration+'&v=2';
	console.log('Making a request to: '+req_url);
	request(req_url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//get json data
			var json = JSON.parse(body);

			//determine what to output
			var videos = json.feed.entry;
			var page = "<ul>";
			var matches = 0;
			
			videos.sort(function(a, b) { 
			    return parseInt(b['media$group']['yt$duration']['seconds']) - parseInt(a['media$group']['yt$duration']['seconds']);
			})
			
			for (var i = 0; i < videos.length; i++)
			{
				var v = videos[i];
				var video = {};
				video.duration = v['media$group']['yt$duration']['seconds'];
				video.title = v['title']['$t'];
				video.link = v['link'][0]['href'];
				video.id = v['media$group']['yt$videoid']['$t'];
				
				var idle_time = parseInt(time_remaining) - parseInt(video.duration);
				if (idle_time > 0)
				{
					//console.log(video.duration, video.title, video.link);
					if (matches == 0)
						page += "<iframe src='http://www.youtube.com/embed/"+video.id+"' width='320' height='190'></iframe>";
					
					page += "<li><a href='"+video.link+"'>"+video.title+"</a> - "+video.duration+" seconds</li>";
					matches++;
				}
			}
			if (matches == 0)
				page = "<li>No videos found.</li>"
			page += "</ul>";
			res.send(page);
		}
	});
});

app.get('/nearby', 
	function(req, res)
	{
		
		request('https://rumobile.rutgers.edu/0.1/rutgersrouteconfig.txt', function (err, data, body) {
			if (err) return console.dir(error)
			rutgers.setAgencyCache((JSON.parse(body)), 'rutgers');
		});
		
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
		
		request('https://rumobile.rutgers.edu/0.1/rutgersrouteconfig.txt', function (err, data, body) {
			if (err) return console.dir(error)
			rutgers.setAgencyCache((JSON.parse(body)), 'rutgers');
		});
		
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

var PORTNUMBER = 3000;
app.listen(PORTNUMBER);
console.log('Listening on port '+PORTNUMBER);
