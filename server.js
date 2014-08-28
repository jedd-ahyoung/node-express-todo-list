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

var apiRouter = express.Router();

apiRouter.use(function(req, res, next) {
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
apiRouter.get('/', function(req, res) {
	res.status(200).json({ status: 'OK' });	
});

apiRouter.route('/items')
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
		Item.find(req.query.archived ? null : { archived: false }, function(err, items) {
			if (err)
				res.send(err);

			res.json(items);
		});
	});

apiRouter.route('/items/:item_id')
	// update
	.put(function(req, res) {
		Item.findById(req.params.item_id, function(err, item) {
			if (err)
				res.status(500).send(err);

			item.finished = req.body.finished || false;
			item.updated = new Date();
			item.entry = req.body.entry || item.entry;

			item.save(function(err) {
				if (err)
					res.status(500).send(err);

				res.json({ data: item });
			});
		});
	})

	// archive.
	.delete(function(req, res) {
		Item.findById(req.params.item_id, function(err, item) {
			if (err)
				res.status(500).send(err);

			item.archived = true;

			item.save(function(err) {
				if (err)
					res.status(500).send(err);

				res.json({ data: item._id });
			})
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', apiRouter);
app.use(express.static(__dirname + '/client'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
