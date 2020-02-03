const 	mongoose = require('mongoose');

const options = {
	discriminatorKey: 'kind',
	timestamps: true,
	new: true,
	upsert: true,
	setDefaultsOnInsert: true
};

// Schema definition

const userSchema = new mongoose.Schema({
	// Twitter user fields
	twid: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	photo: String, // Avatar image url
	description: String,
	url: String,
	// Custom fields
	role: {
		type: String,
		required: true,
		lowercase: true,
		enum: ['user', 'superuser', 'admin'],
		default: 'user'
	},
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Link'
	}],
	flags: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Link'
	}],
	nomLikes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Nominee'
	}]
});

// Virtual fields for easier populate when viewing a user (if needed)

userSchema.virtual('nominations', {
	ref: 'Nominee',
	localField: '_id',
	foreignField: 'user'
});

// Export

module.exports = mongoose.model('User', userSchema);