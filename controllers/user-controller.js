const User = require('../models/user/user');
const userController = {
  showMe: async (req, res, next) => {
    try {
      let user = await User
        .findOne({ _id: req.user.id })
        .populate({
          path: 'likes',
          match: { hidden: false },
          populate: [
            {
              path: 'makers',
              select: 'sortname slug',
              options: {
                sort: { sortname: 'asc' }
              }
            },
            {
              path: 'tags',
              select: 'tag slug',
              options: {
                sort: { tag: 'asc' }
              }
            }
          ],
          options: {
            sort: { sortedtitle: 'asc' }
          }
        })
        .populate({
          path: 'nomLikes',
          populate: {
            path: 'user',
            select: 'username',
          },
          options: {
            sort: { sortedtitle: 'asc' }
          }
        })
        .populate({
          path: 'nominations',
          populate: {
            path: 'user',
            select: 'username'
          },
          options: {
            sort: { sortedtitle: 'asc' }
          }
        })
        .exec();
      if(!user){
        req.flash('error', 'Whoa, something went wrong.');
        res.redirect('/');
      } else {
        let viewTitle = 'My Shit';
        let onelink = true;
        let scriptSrc = ['/js/list.min.js', '/js/user-me.js']
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('users/me', { onelink, user, viewTitle, scriptSrc });
      }
    } catch(err) {
      next(err);
    }
  }
}
module.exports = userController;