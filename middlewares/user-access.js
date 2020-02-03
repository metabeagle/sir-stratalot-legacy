const userAccess = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Hey, you need to sign in to do that.');
    res.redirect('/');
  },
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    req.flash('error', 'Hey, you don’t have permission to do that.');
    res.redirect('/');
  },
  // testing this out
  // destroyCache: (req, res, next) => {
  //  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  //  return next();
  // }
}
module.exports = userAccess;