const 	mongoose 	= require('mongoose'),
		Link 		= require('./link');

// Book discriminator definition

const Extracurricular = Link.discriminator('Extracurricular',
	new mongoose.Schema({
		subkind: {
			type: String,
			trim: true,
			required: true,
			enum: ['Community', 'Education', 'Opportunity']
		},
		location: {
			type: String,
			trim: true
		}
	}));

// Export

module.exports = mongoose.model('Extracurricular');