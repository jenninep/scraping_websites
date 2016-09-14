var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	comment: String,
	status: Boolean
});

module.exports = mongoose.model('User', UserSchema);