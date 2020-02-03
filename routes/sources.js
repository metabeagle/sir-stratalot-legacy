const express           = require('express'),
      router            = express.Router(),
      userAccess        = require('../middlewares/user-access'),
      sourceController  = require('../controllers/source-controller');

// // Index
// router.get('/', cacheMiddleware.cacheRoute(), sourceController.getSources);

// // New
// router.get('/new', userAccess.isAdmin, cacheMiddleware.cacheRoute(), sourceController.newSource);

// // Create
// router.post('/', userAccess.isAdmin, cacheMiddleware.cacheDelete('/sources'), sourceController.createSource);

// // Show
// router.get('/:slug', cacheMiddleware.cacheRoute(), sourceController.showSource);

// // Edit
// router.get('/:slug/edit', userAccess.isAdmin, sourceController.editSource);

// // Update
// router.put('/:id', userAccess.isAdmin, cacheMiddleware.cacheDeleteReferer(), sourceController.updateSource);

// // Delete
// router.delete('/:id', userAccess.isAdmin, cacheMiddleware.cacheDeleteReferer(), sourceController.destroySource);

// module.exports = router;

// Index
router.get('/', sourceController.getSources);

// New
router.get('/new', userAccess.isAdmin, sourceController.newSource);

// Create
router.post('/', userAccess.isAdmin, sourceController.createSource);

// Show
router.get('/:slug', sourceController.showSource);

// Edit
router.get('/:slug/edit', userAccess.isAdmin, sourceController.editSource);

// Update
router.put('/:id', userAccess.isAdmin, sourceController.updateSource);

// Delete
router.delete('/:id', userAccess.isAdmin, sourceController.destroySource);

module.exports = router;