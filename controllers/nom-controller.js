const Nominee = require('../models/nominee/nominee'),
      User    = require('../models/user/user');

// const { redisCache, cacheControl } = require('../services/cache-control');

// function slugPath(slug){
//   return `/nominees/${slug}`;
// }

// async function getOne(slug){
//   try {
//     console.log('returning nom from slow database');
//     let nom = await Nominee
//         .findOne({ slug: slug })
//         .exec();
//   } catch(err){
//     throw err;
//   }
// }

const nomController = {
  getNoms: async (req, res, next) => {
    try {
      let nominees = await Nominee
        .find({ winner: false })
        .sort({ createdAt: 'desc'})
        // Remove name and photo if I don't end up using
        .populate('user', 'name username photo')
        .exec();
      let viewTitle = 'Nominees';
      let metaDesc = 'Community-submitted planning and strategy resources. Sign in to nominate or vote.';
      let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
      let scriptSrc = ['/js/list.min.js', '/js/nominee-index.js'];
      res.render('nominees/index', { nominees, viewTitle, metaDesc, metaUrl, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  newNom: async (req, res, next) => {
    try {
      let viewTitle = 'Nominate a Link';
      let scriptSrc = ['https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.0/jquery.validate.min.js', '/js/nominee-forms.js'];
      res.render('nominees/new', { viewTitle, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  createNom: async (req, res, next) => {
    try {
      let nom = await Nominee.create(req.body.nominee);
      req.flash('info', 'Thanks for submitting—we appreciate it.');
      res.redirect(`/nominees`);
    } catch(err) {
      next(err);
    }
  },
  // showLink: async (req, res, next) => {
  //  try {
  //    let link = await Link
  //      .findOne({ slug: req.params.slug })
  //      .populate('makers', null, null, { sort: { sortname: 'asc' } })
  //      .populate('sources', null, null, { sort: { title: 'asc' } })
  //      .populate('tags', null, null, { sort: { tag: 'asc' } })
  //      .exec();
  //    if(!link){
  //      req.flash('error', 'Nope, that link doesn\'t exist.');
  //      res.redirect('/links');
  //    } else {
  //      res.render('links/show', { link }); 
  //    }
  //  } catch(err) {
  //    next(err);
  //  }
  // },

  // editLink: async (req, res, next) => {
  //  try {
  //    let link = await Link
  //      .findOne({ slug: req.params.slug })
  //      .populate('makers', null, null, { sort: { sortname: 'asc' }})
  //      .populate('sources', null, null, { sort: { title: 'asc' }})
  //      .populate('tags', null, null, { sort: { tag: 'asc' } })
  //      .exec()
  //    res.render('links/edit', { link });
  //  } catch(err) {
  //    next(err);
  //  }
  // },

  // updateLink: async (req, res, next) => {
  //  try {
  //    let queryOptions = {
  //      new: true,
  //      upsert: true,
  //      setDefaultsOnInsert: true
  //    };
  //    let linkUpdate = req.body.link;
  //    if(linkUpdate.kind === 'Article'){
  //      let link = await Article
  //        .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
  //        .exec();
  //      res.redirect(`/links/${link.slug}`);
  //    } else if(linkUpdate.kind === 'Book') {
  //      let link = await Book
  //        .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
  //        .exec();
  //      res.redirect(`/links/${link.slug}`);
  //    } else if(linkUpdate.kind === 'Feed') {
  //      let link = await Feed
  //        .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
  //        .exec();
  //      res.redirect(`/links/${link.slug}`);
  //    } else {
  //      let link = await Link
  //        .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
  //        .exec();
  //      res.redirect(`/links/${link.slug}`);
  //    }
  //  } catch(err) {
  //    next(err);
  //  }
  // },
  likeNom: async (req, res, next) => {
    try {
      let nom = await Nominee.findOne({ _id: req.body.id });
      await nom.like();
      await User
        .findOneAndUpdate({ _id: req.user.id }, { $push: { nomLikes: nom }})
        .exec();
      await res.json(nom.likes);
    } catch(err) {
      next(err);
    }
  },
  unlikeNom: async (req, res, next) => {
    try {
      let nom = await Nominee.findOne({ _id: req.body.id });
      await nom.unlike();
      // For some reason 'pulling' link object from likes doesn't work as it does with likeLink function above
      // Eventually got to this mongoose method solution... 
      let user = await User.findById(req.user.id);
      await user.nomLikes.pull(nom.id);
      await user.save();
      await res.json(nom.likes);
    } catch(err) {
      next(err);
    }
  }
  // flagLink: async (req, res, next) => {
  //  try {
  //    let link = await Link.findOne({ _id: req.body.id });
  //    await link.flag();
  //    await User
  //      .findOneAndUpdate({ _id: req.user.id }, { $push: { flags: link }})
  //      .exec();
  //    await res.json(link.flags);
  //  } catch(err) {
  //    next(err);
  //  }
  // },

  // destroyLink: async (req, res, next) => {
  //  try {
  //    let link = await Link
  //      .findOneAndDelete({ _id: req.params.id })
  //      .exec();
  //    res.redirect('/links');
  //  } catch(err) {
  //    next(err);
  //  }
  // }
}
module.exports = nomController;