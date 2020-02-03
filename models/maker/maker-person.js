const 	mongoose = require('mongoose'),
		Maker = require('./maker');

// Person discriminator definition

const Person = Maker.discriminator('Person',
	new mongoose.Schema({
		first: {
			type: String,
			required: true,
			trim: true
		},
		last: {
			type: String,
			required: true,
			trim: true
		}
	}));

// Export

module.exports = mongoose.model('Person');