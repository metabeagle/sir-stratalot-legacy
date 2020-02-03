const Source  = require('../models/source/source'),
      Maker   = require('../models/maker/maker');

const { redisCache, cacheControl } = require('../services/cache-control');

function slugPath(slug){
  return `/sources/${slug}`;
}

async function getOne(slug){
  try {
    console.log('returning source from slow database');
    return Source
      .findOne({ slug: slug })
      .populate('makers', 'sortname slug', null, { sort: { sortname: 'asc' }})
      .exec();
  } catch(err){
    throw err;
  }
}
 
const sourceController = {
  getSources: async (req, res, next) => {
    try {
      let sources = await Source
        .find()
        .select('-description')
        .sort({ sortedtitle: 'asc'})
        .populate('makers', 'sortname slug')
        .exec();
      let viewTitle = 'Sources';
      let metaDesc = 'Sources and recommendations used to compile Sir Stratalot.';
      let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
      let scriptSrc = ['/js/list.min.js', '/js/source-index.js'];
      res.render('sources/index', { sources, viewTitle, metaDesc, metaUrl, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  newSource: async (req, res, next) => {
    try {
      let viewTitle = 'New Source';
      let scriptSrc = ['https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js', '/js/source-forms.js'];
      res.render('sources/new', { viewTitle, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  searchSources: async (req, res, next) => {
    try {
      let regex = await new RegExp(req.query.term, 'i');
      let query = await Source.find({ title: regex }).sort({ title: 'asc' }).exec();
      let results = await query.map((source) => {
        return {
          id: source._id,
          text: source.title
        }
      });
      res.json(results);
    } catch(err) {
      next(err);
    }
  },
  createSource: async (req, res, next) => {
    try {
      let source = await Source.create(req.body.source);
      res.redirect(`/sources/${source.slug}`);
    } catch(err) {
      next(err);
    }
  },
  showSource: async (req, res, next) => {
    try {
      let source = await redisCache.wrap(cacheControl.createKey(req.originalUrl), function(){
        return getOne(req.params.slug);
      });
      if(!source){
        req.flash('error', 'Nope, that source doesn’t exist.');
        res.redirect('/sources');
      } else {
        let makerList = await source.makers.map(maker => maker.sortname).join(', ');
        let viewTitle = source.title.toString();
        let metaDesc = `[Source] ${source.title.toString()} by ${makerList}. ${source.description.toString()}`;
        let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
        res.render('sources/show', { source, viewTitle, metaDesc, metaUrl });
      }
    } catch(err) {
      next(err);
    }
  },
  editSource: async (req, res, next) => {
    try {
      let source = await Source
        .findOne({ slug: req.params.slug })
        .populate('makers', null, null, { sort: { sortname: 'asc' }})
        .exec();
      let viewTitle = 'Edit Source';
      let scriptSrc = ['https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js', '/js/source-forms.js'];
      res.render('sources/edit', { source, viewTitle, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  updateSource: async (req, res, next) => {
    try {
      let queryOptions = {
        new: true,
        upsert: true
      };
      let sourceUpdate = req.body.source;
      cacheControl.delOne(cacheControl.createKey(slugPath(sourceUpdate.slug)));
      let source = await Source
        .findOneAndUpdate({ _id: req.params.id }, {$set: sourceUpdate }, queryOptions)
        .exec();
      res.redirect(`/sources/${source.slug}`);
    } catch(err) {
      next(err);
    }
  },
  destroySource: async (req, res, next) => {
    try {
      let source = await Source
        .findOneAndDelete({ _id: req.params.id })
        .exec();
      cacheControl.delOne(cacheControl.createKey(slugPath(source.slug)));
      res.redirect('/sources');
    } catch(err) {
      next(err);
    }
  }
}
module.exports = sourceController;