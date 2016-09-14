var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');
// var logger = require('morgan');
var mongoose = require('mongoose');


// require models
var user = require('./models/user.js');
var note = require('./models/note.js')
var Article = require('./models/article.js');


app.use(bodyParser.urlencoded({
	extended:false
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/cherrio_scraper');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

app.get('/', function(req, res) {
  res.send(index.html);
});



app.get('/scrape', function(req, res){
	request('http://www.huffingtonpost.com', function (err, response, html){
	if (err) {
		throw err;
	}

	var $ = cheerio.load(html);
	var results = [];

	$('h2.card__headline.js-card-headline').each(function(index, element){
		var title = $(element).text();
		var link = $(element).find('a').first().attr('href');
		var thumbnail = $(element).parent().parent().find('img.card__image__src').first().attr('src');
		console.log($(element).parent());

		results.push({
			title: title,
			link: link,
			thumbnail_pic: thumbnail
		});
		// var entry = new Article(results);

  //           entry.save(function(err, doc) {
  //               if (err) {
  //                   console.log(err);
  //               } else {
  //                   console.log(doc);
  //               }
  //           });
	});
		console.log('Here are your results:', results);
		 res.send("Scrape Complete");
	});
	
});

// gets all of the articles scraped from mongoDB
app.get('/articles', function(req, res) {
	Article.find({}, function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// grab article by its ObjectID
app.get('/articles/:id', function(req, res) {
	Article.findOne({'_id': req.params.id})

	.populate('note')
	.exec(function(err, doc) {
		if(err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

//replace the existing note of an article with a new one, or if no note exists for an article, make the posted note its note.
app.post('/articles/:id', function(req, res) {
	var newNote = new Note(req.body);
	newNote.save(function(err, doc) {
		if(err) {
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc) {
				if(err) {
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});


// tell app to listen on 3000
app.listen(3000, function() {
    console.log('App running on port 3000!');
});






// var express = require('express');
// var app = express();
// var mongojs = require('mongojs');
// var bodyParser = require('body-parser');
// var request = require('request');
// var cheerio = require('cheerio');

// // create a mongo db for articles, with headline, and link
// var db = mongojs('huffPosts', ['articles']);

// db.on('error', function(err) {
//     console.log('Database Error:', err);
// });
// console.log(db);

// // insert sample data
// // db.collection.insert(docOrDocs, [callback])
// // link: http://www.huffingtonpost.com/2013/05/29/samesies-video-gave-cavem_n_3352597.html?ir=Gay+Voices
// // headline: ‘Samesies’: What’s Wrong With Gay Cavemen Procreating? (VIDEO)
// function createSample() {
//     var sample = {
//         link: "http://www.huffingtonpost.com/2013/05/29/samesies-video-gave-cavem_n_3352597.html?ir=Gay+Voices",
//         headline: "‘Samesies’: What’s Wrong With Gay Cavemen Procreating"
//     };

//     db.articles.insert(sample);
//     db.articles.find(function(err, docs) {
//         console.log(docs);
//     });
// }

// function deleteSample() {
//     db.articles.remove({
//         link: "http://www.huffingtonpost.com/2013/05/29/samesies-video-gave-cavem_n_3352597.html?ir=Gay+Voices"
//     });
// }
// // createSample();
// // 

// // app.use(bodyParser.urlencoded({
// // 	extendd:false
// // }));
// // app.use(express.static('public'));

// // app.get('/scrape', function(req, res){

// request('http://www.huffingtonpost.com', function(err, response, html) {
//     if (err) {
//         throw err;
//     }

//     var $ = cheerio.load(html);
//     var results = [];

//     $('h2.card__headline.js-card-headline').each(function(index, element) {
//         var title = ;
//         var link = $(element).find('a').first().attr('href');

//         results.push({
//             title: title,
//             link: link
//         });
//         // db.articles.find({title: $(element).text()}).
//         // check if our database contains r
//         // 
//         // var bulk = db.articles.initializeOrderedBulkOp();

//         // db.articles.insert({
//         //     title: $(element).text(),
//         //     link: $(element).find('a').first().attr('href')
//         // });
//         // db.articles.find(function(err, docs) {
//         //     console.log(docs);
//         // })
//         // db.articles.insert(results);
//     });
//     // console.log('Here are your results:', results);

// });
// // when user goes to home
// app.get('/', function(req, res) {
//     // send the articles from db to browser (as json)
//     db.articles.find(function(err, docs) {
//         res.json(docs);
//     })
// });



// // });
