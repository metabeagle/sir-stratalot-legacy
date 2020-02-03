const 	express 			= require('express'),
		router 				= express.Router(),
		userAccess			= require('../middlewares/user-access'),
		makerController 	= require('../controllers/maker-controller'),
		sourceController 	= require('../controllers/source-controller'),
		linkController		= require('../controllers/link-controller'),
		tagController 		= require('../controllers/tag-controller'),
		nomController		= require('../controllers/nom-controller');

// Makers search
router.get('/makers', userAccess.isAdmin, makerController.searchMakers);

// Sources search
router.get('/sources', userAccess.isAdmin, sourceController.searchSources);

// Tags search
router.get('/tags', userAccess.isAdmin, tagController.searchTags);

// Link like
router.post('/links/like', userAccess.isLoggedIn, linkController.likeLink);

// Link unlike
router.post('/links/unlike', userAccess.isLoggedIn, linkController.unlikeLink);

// Link flag
router.post('/links/flag', userAccess.isLoggedIn, linkController.flagLink);

// Nominee like
router.post('/nominees/like', userAccess.isLoggedIn, nomController.likeNom);

// Nominee unlike
router.post('/nominees/unlike', userAccess.isLoggedIn, nomController.unlikeNom);

module.exports = router;