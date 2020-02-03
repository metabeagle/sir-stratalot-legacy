const express         = require('express'),
      router          = express.Router(),
      userAccess      = require('../middlewares/user-access'),
      tagController   = require('../controllers/tag-controller');

// Index
router.get('/', tagController.getTags);

// New
router.get('/new', userAccess.isAdmin, tagController.newTag);

// Update prefetch
router.get('/prefetch', userAccess.isAdmin, tagController.updatePrefetch);

// Download prefetch
router.get('/downloadprefetch', userAccess.isAdmin, tagController.downloadPrefetch);

// Create
router.post('/', userAccess.isAdmin, tagController.createTag);

// Show
router.get('/:slug', tagController.showTag);

// Edit
router.get('/:slug/edit', userAccess.isAdmin, tagController.editTag);

// Set Featured
router.get('/:slug/featured', userAccess.isAdmin, tagController.setFeatured);

// Update
router.put('/:id', userAccess.isAdmin, tagController.updateTag);

// Delete
router.delete('/:id', userAccess.isAdmin, tagController.destroyTag);

module.exports = router;