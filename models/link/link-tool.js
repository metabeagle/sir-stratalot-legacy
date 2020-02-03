const 	mongoose 	= require('mongoose'),
		Link 		= require('./link');

// Tool discriminator definition

const Tool = Link.discriminator('Tool',
	new mongoose.Schema({
		subkind: {
			type: String,
			trim: true,
			required: true,
			enum: ['Research Tool', 'Service', 'Toolkit', 'Utility']
		},
		cost: {
			type: String,
			trim: true,
			required: true
		}
	}));

// Export

module.exports = mongoose.model('Tool');