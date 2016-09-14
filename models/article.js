var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//article schema
var ArticleSchema = new Schema({
	title: {
		type:String,
		required: true
	},

	link: {
		type: String,
		required: true
	},
	image: {
		type: String

	},
	note: {
		type: Schema.Types.ObjectId,
		ref: 'Note'
	}
});

var Article = mongoose.model('Article', ArticleSchema);

// exporting the model
module.exports = Article;