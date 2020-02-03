const 	mongoose 	= require('mongoose'),
		Link 		= require('./link');

// Single discriminator definition

const Single = Link.discriminator('Single',
	new mongoose.Schema({
		subkind: {
			type: String,
			trim: true,
			required: true,
			enum: ['Article', 'Presentation', 'Report', 'Video']
		},
		embedurl: {
			type: String,
			trim: true
		},
		published: {
			type: Date,
			required: true
		}
	}));

// Export

module.exports = mongoose.model('Single');