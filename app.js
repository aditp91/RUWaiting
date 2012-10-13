var express = require('express');
var app = express();


app.get('/', function(req, res) {
    var request = require('request');
    var query = req.query['search'] || 'comedy';
    var duration = req.query['duration'] || 'long';
    request('https://gdata.youtube.com/feeds/api/videos?alt=json&q='+query+'&duration='+duration+'&v=2', function (error, response, body) {
	if (!error && response.statusCode == 200) {
	    var json = JSON.parse(body);
	    var page = json.feed.entry;
	    res.send(page);
	}
    })
});

app.listen(3000);
console.log('Listening on port 3000');
