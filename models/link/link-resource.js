const 	mongoose 	= require('mongoose'),
		Link 		= require('./link');

// Resource discriminator definition

const Resource = Link.discriminator('Resource',
	new mongoose.Schema({
		subkind: {
			type: String,
			trim: true,
			required: true,
			enum: ['Case Study', 'Meta', 'Reference', 'Research']
		},
		published: {
			type: Date
		}
	}));

// Export

module.exports = mongoose.model('Resource');