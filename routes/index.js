const express         = require('express'),
      router          = express.Router(),
      skipMiddleware  = require('../middlewares/skip-middleware'),
      indexController = require('../controllers/index-controller');

router.get('/', skipMiddleware.skipQuery, indexController.getIndex);

router.get('/about', (req, res, next) => {
  try {
    let viewTitle = 'About';
    let metaDesc = 'About Sir Stratalot.';
    let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
    res.render('pages/about', { viewTitle, metaDesc, metaUrl });
  }
  catch(err) {
    next(err);
  }
});

router.get('/cookies', (req, res, next) => {
  try {
    let viewTitle = 'Cookie Policy';
    res.render('pages/cookiepolicy', { viewTitle });
  } 
  catch(err) {
    next(err);
  }
});

router.get('/privacy', (req, res, next) => {
  try {
    let viewTitle = 'Privacy Policy';
    res.render('pages/privacypolicy', { viewTitle });
  } 
  catch(err) {
    next(err);
  }
});

router.get('/contribute', (req, res, next) => {
  try {
    let viewTitle = 'Contribute';
    let metaDesc = 'Help Sir Stratalot fight the dragon of economic reality. Find out how to support this project.'
    let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
    res.render('pages/contribute', { viewTitle, metaDesc, metaUrl });
  } 
  catch(err) {
    next(err);
  }
});

module.exports = router;

