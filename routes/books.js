const   express         = require('express'),
        router          = express.Router(),
        userAccess      = require('../middlewares/user-access'),
        bookController  = require('../controllers/book-controller');

// Index
router.get('/', userAccess.isAdmin, bookController.getLinks);

// Show
// router.get('/:slug', bookController.showLink);

module.exports = router;