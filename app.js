var express = require('express');
var app = express();


app.get('/', function(req, res) {
	var request = require('request');
	var query = req.query['search'] || 'comedy';
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
			for (var i = 0; i < videos.length; i++)
			{
				var v = videos[i];
				var video = {};
				video.duration = v['media$group']['yt$duration']['seconds'];
				video.title = v['title']['$t'];
				video.link = v['link'][0]['href'];
				
				var idle_time = parseInt(time_remaining) - parseInt(video.duration);
				if (idle_time > 0 && idle_time < 60)
				{
					//console.log(video.duration, video.title, video.link);
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

var PORTNUMBER = 3000;
app.listen(PORTNUMBER);
console.log('Listening on port '+PORTNUMBER);
