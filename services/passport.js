const 	passport			= require('passport'),
		TwitterStrategy		= require('passport-twitter').Strategy,
		mongoose			= require('mongoose'),
		keys				= require('../config/keys'),
		User				= require('../models/user/user');

// .id below is a mongoose default virtual getter that casts ObjectId to a string (who knew)?
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			console.log(err);
		});
});

// Passport Twitter strategy setup

passport.use(new TwitterStrategy({
	consumerKey: keys.twitterConsumerKey,
	consumerSecret: keys.twitterConsumerSecret,
	callbackURL: keys.callbackURL,
	proxy: true
	// includeEmail: true

}, (token, tokenSecret, profile, done) => {

	User.findOne({ twid: profile.id })
		.then((existingUser) => {
			if (existingUser) {
				existingUser.username = profile.username;
				existingUser.name = profile.displayName;
				existingUser.photo = profile.photos[0].value;
				existingUser.description = profile._json.description;
				if(profile._json.entities.url){
					existingUser.url = profile._json.entities.url.urls[0].expanded_url;
				}
				existingUser.save().then((savedUser) => {
					done(null, savedUser);
				});
			} else {
				if(!profile._json.entities.url){
					new User({
						twid: profile.id,
						username: profile.username,
						name: profile.displayName,
						photo: profile.photos[0].value,
						description: profile._json.description
					}).save()
					.then((savedUser) => {
						done(null, savedUser);
					});
				} else {
					new User({
					twid: profile.id,
					username: profile.username,
					name: profile.displayName,
					photo: profile.photos[0].value,
					description: profile._json.description,
					url: profile._json.entities.url.urls[0].expanded_url
					}).save()
					.then((savedUser) => {
						done(null, savedUser);
					});
				}
			}
		}).catch((err) => {
			console.log(err);
		});
}));

// Export
// module.exports = passportService;