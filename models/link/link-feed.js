const 	mongoose 	= require('mongoose'),
		Link 		= require('./link');

// Book discriminator definition

const Feed = Link.discriminator('Feed',
	new mongoose.Schema({
		subkind: {
			type: String,
			trim: true,
			required: true,
			enum: ['Blog', 'Newsletter', 'Podcast', 'YouTube']
		}
	}));

// Export

module.exports = mongoose.model('Feed');