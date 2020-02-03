const 	mongoose = require('mongoose'),
		Maker = require('./maker');

// Organization discriminator definition

const Organization = Maker.discriminator('Organization',
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
			trim: true
		}
	}));

// Export

module.exports = mongoose.model('Organization');