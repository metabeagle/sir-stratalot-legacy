const Link            = require('../models/link/link'),
      Single          = require('../models/link/link-single'),
      Book            = require('../models/link/link-book'),
      Feed            = require('../models/link/link-feed'),
      Resource        = require('../models/link/link-resource'),
      Tool            = require('../models/link/link-tool'),
      Extracurricular = require('../models/link/link-extra'),
      Maker           = require('../models/maker/maker'),
      Source          = require('../models/source/source'),
      User            = require('../models/user/user'),
      url             = require('url'),
      fs              = require('fs');

const { redisCache, cacheControl } = require('../services/cache-control');

function slugPath(slug){
  return `/links/${slug}`;
}

// function referPath(refUrl){
//   return url.parse(refUrl).pathname;
// }

async function getOne(slug){
  try {
    console.log('returning link from slow database');
    return Link
      .findOne({ slug: slug })
      .populate('makers', 'sortname slug', null, { sort: { sortname: 'asc' } })
      .populate('tags', 'tag slug', null, { sort: { tag: 'asc' } })
      .populate ('sources', 'title slug', null, { sort: { title: 'asc' } })
      .populate('user', 'name username')
      .exec();
  } catch(err){
    throw err;
  }
}

// async function getAll(slug){
//   try {
//     console.log('returning links from slow database');
//     return Link
//       .find({ hidden: false }, '-description -sources -attribution -flags -imgurl -logourl -user')
//       .sort({ sortedtitle: 'asc'})
//       .populate('makers', 'sortname slug', null, { sort: { sortname: 'asc' } })
//       .populate('tags', 'tag slug', null, { sort: { tag: 'asc' } })
//       .exec();
//   } catch(err){
//     throw err;
//   }
// }

const linkController = {
  getLinks: async (req, res, next) => {
    try {
      let links = await Link
        .find({ hidden: false }, '-description -sources -attribution -flags -imgurl -logourl -user')
        .sort({ sortedtitle: 'asc'})
        .populate('makers', 'sortname slug', null, { sort: { sortname: 'asc' } })
        .populate('tags', 'tag slug', null, { sort: { tag: 'asc' } })
        .exec();
      let viewTitle = 'Links';
      let metaDesc = 'Resources for planners and strategists. Articles, books, reports, research, tools, communities, and more.';
      let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
      let onelink = true;
      let scriptSrc = ['/js/list.min.js', '/js/link-index.js'];
      res.render('links/index', { onelink, links, viewTitle, metaDesc, metaUrl, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  newLink: async (req, res, next) => {
    try {
      let viewTitle = 'New Link';
      let scriptSrc = ['https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js', '/js/link-forms.js'];
      res.render('links/new', { viewTitle, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  createLink: async (req, res, next) => {
    try {
      let link = await Link.create(req.body.link);
      res.redirect(`/links/${link.slug}`);
    } catch(err) {
      next(err);
    }
  },
  showLink: async (req, res, next) => {
    try {
      let link = await redisCache.wrap(cacheControl.createKey(req.originalUrl), function(){
        return getOne(req.params.slug);
      });
      if(!link){
        req.flash('error', 'Nope, that link doesn’t exist.');
        res.redirect('/links');
      } else {
        let makerList = await link.makers.map(maker => maker.sortname).join(', ');
        let viewTitle = link.title.toString();
        let metaDesc;
        if(link.title === link.makers[0].sortname){
          metaDesc = `[${link.subkind.toString()}] ${link.title.toString()}. ${link.description.toString()}`;
        } else {
          metaDesc = `[${link.subkind.toString()}] ${link.title.toString()} by ${makerList}. ${link.description.toString()}`;
        }
        let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
        let onelink = true;
        let scriptSrc = ['/js/link-show.js']
        res.render('links/show', { onelink, link, viewTitle, metaDesc, metaUrl, scriptSrc });
      }
    } catch(err) {
      next(err);
    }
  },
  editLink: async (req, res, next) => {
    try {
      let scriptSrc = await ['https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js', '/js/link-forms.js'];
      let link = await Link
        .findOne({ slug: req.params.slug })
        .populate('makers', null, null, { sort: { sortname: 'asc' }})
        .populate('sources', null, null, { sort: { title: 'asc' }})
        .populate('tags', null, null, { sort: { tag: 'asc' } })
        .exec()
      // let { body: html, url } = await got(link.url);
      // let metadata = await metascraper({ html, url });
      let viewTitle = 'Edit Link';
      // console.log(metadata);
      res.render('links/edit', { scriptSrc, link, viewTitle }); // deleted metadata var from here
    } catch(err) {
      next(err);
    }
  },
  updateLink: async (req, res, next) => {
    try {
      let queryOptions = {
        new: true,
        upsert: true
      };
      let linkUpdate = req.body.link;
      cacheControl.delOne(cacheControl.createKey(slugPath(linkUpdate.slug)));
      if(linkUpdate.kind === 'Single'){
        let link = await Single
          .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
          .exec();
          res.redirect(`/links/${link.slug}`);
      } else if(linkUpdate.kind === 'Book') {
        let link = await Book
          .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
          .exec();
          res.redirect(`/links/${link.slug}`);
      } else if(linkUpdate.kind === 'Feed') {
        let link = await Feed
          .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
          .exec();
          res.redirect(`/links/${link.slug}`);
      } else if(linkUpdate.kind === 'Resource') {
        let link = await Resource
          .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
          .exec();
          res.redirect(`/links/${link.slug}`);
      } else if(linkUpdate.kind === 'Tool') {
        let link = await Tool
          .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
          .exec();
          res.redirect(`/links/${link.slug}`);
      } else if(linkUpdate.kind === 'Extracurricular') {
        let link = await Extracurricular
          .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
          .exec();
          res.redirect(`/links/${link.slug}`);
      } else {
        let link = await Link
          .findOneAndUpdate({ _id: req.params.id }, { $set: linkUpdate }, queryOptions)
          .exec();
          res.redirect(`/links/${link.slug}`);
      }
    } catch(err) {
      next(err);
    }
  },
  likeLink: async (req, res, next) => {
    try {
      let link = await Link.findOne({ _id: req.body.id });
      cacheControl.delOne(cacheControl.createKey(slugPath(link.slug)));
      await link.like();
      await User
        .findOneAndUpdate({ _id: req.user.id }, { $push: { likes: link }})
        .exec();
      await res.json(link.likes);
    } catch(err) {
      next(err);
    }
  },
  unlikeLink: async (req, res, next) => {
    try {
      let link = await Link.findOne({ _id: req.body.id });
      cacheControl.delOne(cacheControl.createKey(slugPath(link.slug)));
      await link.unlike();
      // For some reason 'pulling' link object from likes doesn't work as it does with likeLink function above
      // Eventually got to this mongoose method solution... 
      let user = await User.findById(req.user.id);
      await user.likes.pull(link.id);
      await user.save();
      await res.json(link.likes);
    } catch(err) {
      next(err);
    }
  },
  flagLink: async (req, res, next) => {
    try {
      let link = await Link.findOne({ _id: req.body.id });
      cacheControl.delOne(cacheControl.createKey(slugPath(link.slug)));
      await link.flag();
      await User
        .findOneAndUpdate({ _id: req.user.id }, { $push: { flags: link }})
        .exec();
      await res.json(link.flags);
    } catch(err) {
      next(err);
    }
  },
  destroyLink: async (req, res, next) => {
    try {
      let link = await Link
        .findOneAndDelete({ _id: req.params.id })
        .exec();
      cacheControl.delOne(cacheControl.createKey(slugPath(link.slug)));
      res.redirect('/links');
    } catch(err) {
      next(err);
    }
  },
  updatePrefetch: async (req, res, next) => {
    try {
      exportLinks();
      req.flash('success', 'Links prefetch data updated.');
      res.redirect('/links');
    } catch(err) {
      next(err);
    }
  },
  downloadPrefetch: async (req, res, next) => {
    try {
      res.download(__dirname + '/../public/data/links.json');
    } catch(err) {
      next(err);
    }
  }
}
async function exportLinks(){
  let links = await Link
    .find({ hidden: false })
    .lean()
    .select('subkind title slug')
    .exec();
  let data = JSON.stringify(links);
  if(process.env.NODE_ENV === 'production'){
    fs.writeFile(__dirname + '/../public/data/links.json', data, (err) => {
      if (err) throw (err);
      console.log('links saved to json');
    });
  } else {
    fs.writeFile(__dirname + '/../public/data/links-local.json', data, (err) => {
      if (err) throw (err);
      console.log('links-local saved to json');
    });
  }
}
module.exports = linkController;