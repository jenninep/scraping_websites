var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');


// app.use(bodyParser.urlencoded({
// 	extendd:false
// }));
// app.use(express.static('public'));


// app.get('/scrape', function(req, res){
	

	request('http://www.huffingtonpost.com', function (err, response, html){
	if (err) {
		throw err;
	}

	var $ = cheerio.load(html);
	var results = [];

	$('h2.card__headline.js-card-headline').each(function(index, element){
		var title = $(element).text();
		var link = $(element).find('a').first().attr('href');
		
		results.push({
			title: title,
			link: link
			});
		});
		console.log('Here are your results:', results);
	});
	
// });

