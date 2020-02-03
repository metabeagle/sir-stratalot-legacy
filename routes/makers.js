const express         = require('express'),
      router          = express.Router(),
      userAccess      = require('../middlewares/user-access'),
      makerController = require('../controllers/maker-controller');

// Index
router.get('/', makerController.getMakers);

// New
router.get('/new', userAccess.isAdmin, makerController.newMaker);

// Update prefetch
router.get('/prefetch', userAccess.isAdmin, makerController.updatePrefetch);

// Download prefetch
router.get('/downloadprefetch', userAccess.isAdmin, makerController.downloadPrefetch);

// Create
router.post('/', userAccess.isAdmin, makerController.createMaker);

// Show
router.get('/:slug', makerController.showMaker);

// Edit
router.get('/:slug/edit', userAccess.isAdmin, makerController.editMaker);

// Update
router.put('/:id', userAccess.isAdmin, makerController.updateMaker);

// Delete
router.delete('/:id', userAccess.isAdmin, makerController.destroyMaker);

module.exports = router;