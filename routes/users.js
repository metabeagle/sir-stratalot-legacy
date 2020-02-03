const express         = require('express'),
      router          = express.Router(),
      userAccess      = require('../middlewares/user-access'),
      userController  = require('../controllers/user-controller');

// Show
router.get('/me', userAccess.isLoggedIn, userController.showMe);
module.exports = router;