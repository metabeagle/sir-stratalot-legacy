const 	express 	= require('express'),
		router 		= express.Router(),
		passport	= require('passport'),
		userAccess	= require('../middlewares/user-access');

router.get('/twitter', passport.authenticate('twitter', {
	// scope: [ 'include_email=true' ]
}));

router.get('/twitter/callback', 
	passport.authenticate('twitter', { 
		failureRedirect: '/' 
	}), (req, res) => {
		res.redirect('/');
	});

// come back to this...
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;