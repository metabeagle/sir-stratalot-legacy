const express         = require('express'),
      router          = express.Router(),
      userAccess      = require('../middlewares/user-access'),
      linkController  = require('../controllers/link-controller');

// Index
router.get('/', linkController.getLinks);

// New
router.get('/new', userAccess.isAdmin, linkController.newLink);

// Update prefetch
router.get('/prefetch', userAccess.isAdmin, linkController.updatePrefetch);

// Download prefetch
router.get('/downloadprefetch', userAccess.isAdmin, linkController.downloadPrefetch);

// Create
router.post('/', userAccess.isAdmin, linkController.createLink);

// Show
router.get('/:slug', linkController.showLink);

// Edit
router.get('/:slug/edit', userAccess.isAdmin, linkController.editLink);

// Update
router.put('/:id', userAccess.isAdmin, linkController.updateLink);

// Delete
router.delete('/:id', userAccess.isAdmin, linkController.destroyLink);

module.exports = router;