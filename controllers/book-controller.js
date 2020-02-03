const Link            = require('../models/link/link'),
      // Single          = require('../models/link/link-single'),
      Book            = require('../models/link/link-book'),
      // Feed            = require('../models/link/link-feed'),
      // Resource        = require('../models/link/link-resource'),
      // Tool            = require('../models/link/link-tool'),
      // Extracurricular = require('../models/link/link-extra'),
      Maker           = require('../models/maker/maker'),
      Source          = require('../models/source/source'),
      User            = require('../models/user/user');
      // metascraper     = require('metascraper'),
      // got             = require('got');

const bookController = {
  getLinks: async (req, res, next) => {
    try {
      let links = await Link
        .find({ kind: 'Book', hidden: false }, '-description')
        .sort({ sortedtitle: 'asc'})
        .populate('makers', 'sortname slug', null, { sort: { sortname: 'asc' } })
        .populate('tags', 'tag slug', null, { sort: { tag: 'asc' } })
        .exec();
      let viewTitle = 'Bookshelf';
      let metaDesc = 'Books for planners and strategists.';
      let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
      let onelink = true;
      let scriptSrc = ['/js/list.min.js', '/js/book-index.js'];
      res.render('bookshelf/index', { onelink, links, viewTitle, metaDesc, metaUrl, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  // showLink: async (req, res, next) => {
  //   try {
  //     let link = await Link
  //       .findOne({ slug: req.params.slug })
  //       .populate('makers', 'sortname slug', null, { sort: { sortname: 'asc' } })
  //       .populate('tags', 'tag slug', null, { sort: { tag: 'asc' } })
  //       .populate ('sources', 'title slug', null, { sort: { title: 'asc' } })
  //       .populate('user', 'name username')
  //       .exec();
  //     if(!link){
  //       req.flash('error', 'Nope, that link doesn’t exist.');
  //       res.redirect('/links');
  //     } else {
  //       let makerList = await link.makers.map(maker => maker.sortname).join(', ');
  //       let viewTitle = link.title.toString();
  //       let metaDesc;
  //       if(link.title === link.makers[0].sortname){
  //         metaDesc = `[${link.subkind.toString()}] ${link.title.toString()}. ${link.description.toString()}`;
  //       } else {
  //         metaDesc = `[${link.subkind.toString()}] ${link.title.toString()} by ${makerList}. ${link.description.toString()}`;
  //       }
  //       let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
  //       let onelink = true;
  //       let scriptSrc = ['/js/link-show.js']
  //       res.render('links/show', { onelink, link, viewTitle, metaDesc, metaUrl, scriptSrc });
  //     }
  //   } catch(err) {
  //     next(err);
  //   }
  // },
  // likeLink: async (req, res, next) => {
  //   try {
  //     let link = await Link.findOne({ _id: req.body.id });
  //     await link.like();
  //     await User
  //       .findOneAndUpdate({ _id: req.user.id }, { $push: { likes: link }})
  //       .exec();
  //     await res.json(link.likes);
  //   } catch(err) {
  //     next(err);
  //   }
  // },
  // unlikeLink: async (req, res, next) => {
  //   try {
  //     let link = await Link.findOne({ _id: req.body.id });
  //     await link.unlike();
  //     // For some reason 'pulling' link object from likes doesn't work as it does with likeLink function above
  //     // Eventually got to this mongoose method solution... 
  //     let user = await User.findById(req.user.id);
  //     await user.likes.pull(link.id);
  //     await user.save();
  //     await res.json(link.likes);
  //   } catch(err) {
  //     next(err);
  //   }
  // },
  // flagLink: async (req, res, next) => {
  //   try {
  //     let link = await Link.findOne({ _id: req.body.id });
  //     await link.flag();
  //     await User
  //       .findOneAndUpdate({ _id: req.user.id }, { $push: { flags: link }})
  //       .exec();
  //     await res.json(link.flags);
  //   } catch(err) {
  //     next(err);
  //   }
  // }
}
module.exports = bookController;