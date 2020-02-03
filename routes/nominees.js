const express         = require('express'),
      router          = express.Router();
      userAccess      = require('../middlewares/user-access'),
      nomController   = require('../controllers/nom-controller');

// Index
router.get('/', nomController.getNoms);

// New
router.get('/new', userAccess.isLoggedIn, nomController.newNom);

// Create
router.post('/', userAccess.isLoggedIn, nomController.createNom);

// // Show
// // router.get('/:slug', linkController.showLink);

// // Edit
// // router.get('/:slug/edit', userAccess.isAdmin, linkController.editLink);

// // Update
// // router.put('/:id', userAccess.isAdmin, linkController.updateLink);

// // Delete
// // router.delete('/:id', userAccess.isAdmin, linkController.destroyLink);

module.exports = router;