var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema   = new Schema({
	_id: String,
	finished: Boolean,
	archived: Boolean,
	created: Date,
	updated: Date, 
	entry: String
});

module.exports = mongoose.model('Item', ItemSchema);