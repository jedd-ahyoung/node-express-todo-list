// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var uuid       = require('node-uuid');

// configure app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port       = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://jedd:pass7531@kahana.mongohq.com:10094/jedd_staging'); // connect to our database
var Item       = require('./app/models/item');

// ROUTES FOR OUR API
// =============================================================================

var router = express.Router();

router.use(function(req, res, next) {
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.status(200).json({ status: 'OK' });	
});

router.route('/items')
	.post(function(req, res) {
		var item = new Item();
		item._id = uuid.v4();
		item.finished = req.body.finished || false;
		item.archived = req.body.archived || false;
		item.created = new Date();
		item.updated = item.created;
		item.entry = req.body.entry || "";

		item.save(function(err) {
			if (err)
				res.status(500).send(err);

			res.status(200).json({ data: item }); // TODO: Maybe better to get the data from db.
		});
	})

	.get(function(req, res) {
		console.log(req.query);
		Item.find(req.query.archived ? null : { archived: false }, function(err, items) {
			if (err)
				res.send(err);

			res.json(items);
		});
	});

// on routes that end in /birds/:bird_id
// ----------------------------------------------------
//router.route('/birds/:bird_id')
//
//	// get the bird with that id
//	.get(function(req, res) {
//		Bird.findById(req.params.bird_id, function(err, bird) {
//			if (err)
//				res.send(err);
//			res.json(bird);
//		});
//	})
//
//	// update the bird with this id
//	.put(function(req, res) {
//		Bird.findById(req.params.bird_id, function(err, bird) {
//
//			if (err)
//				res.send(err);
//
//			bird.name = req.body.name;
//			bird.save(function(err) {
//				if (err)
//					res.send(err);
//
//				res.json({ message: 'Bird updated!' });
//			});
//
//		});
//	})
//
//	// delete the bird with this id
//	.delete(function(req, res) {
//		Bird.remove({
//			_id: req.params.bird_id
//		}, function(err, bird) {
//			if (err)
//				res.send(err);
//
//			res.json({ message: 'Successfully deleted' });
//		});
//	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
