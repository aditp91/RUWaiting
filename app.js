var express = require('express');
var app = express();


app.get('/', function(req, res) {
	var request = require('request');
	var query = req.query['search'] || 'comedy';
	var time_remaining = req.query['duration'] || '300';
	
	if (time_remaining < 240)
		duration = 'short';
	else if (time_remaining <= 1200)
		duration = 'medium';
	else
		duration = 'long';
	
	request('https://gdata.youtube.com/feeds/api/videos?alt=json&q='+query+'&duration='+duration+'&v=2', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//get json data
			var json = JSON.parse(body);

			//determine what to output
			var videos = json.feed.entry;
			var page = "<ul>";
			for (var i = 0; i < videos.length; i++)
			{
				var video = videos[i];
				var duration = video['media$group']['yt$duration']['seconds'];
				var title = video['title']['$t'];
				var link = video['link'][0]['href'];
				
				console.log(duration, title, link);
				
				page += "<li><a href='"+link+"'>"+title+"</a> - "+duration+" seconds</li>";
			}
			page += "</ul>";
			res.send(page);
		}
	});
});

var PORTNUMBER = 3000;
app.listen(PORTNUMBER);
console.log('Listening on port '+PORTNUMBER);
