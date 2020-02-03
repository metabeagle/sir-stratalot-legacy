const   Maker       = require('../models/maker/maker'),
        Person      = require('../models/maker/maker-person'),
        Organization  = require('../models/maker/maker-organization'),
        Source      = require('../models/source/source'),
        Link      = require('../models/link/link'),
        fs        = require('fs');

const { redisCache, cacheControl } = require('../services/cache-control');

function slugPath(slug){
  return `/makers/${slug}`;
}

// async function getOne(slug){
//   try {
//     console.log('returning maker from slow database');
//     return Maker
//       .findOne({ slug: slug })
//       .exec();
//   } catch(err){
//     throw err;
//   }
// }

const makerController = {
  getMakers: async (req, res, next) => {
    try {
      let makers = await Maker
        .find()
        .sort({ sortname: 'asc'})
        .populate('sources links')
        .exec();
      let viewTitle = 'Makers';
      let metaDesc = 'Explore planning and strategy resources by maker.';
      let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
      let scriptSrc = ['/js/list.min.js', '/js/maker-index.js'];
      res.render('makers/index', { makers, viewTitle, metaDesc, metaUrl, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  newMaker: async (req, res, next) => {
    try {
      let viewTitle = 'New Maker';
      let scriptSrc = ['https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js', '/js/maker-forms.js'];
      res.render('makers/new', { viewTitle, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  searchMakers: async (req, res, next) => {
    try {
      let regex = await new RegExp(req.query.term, 'i');
      let query = await Maker.find({ sortname: regex }).sort({ sortname: 'asc' }).exec();
      let results = await query.map((maker) => {
        return {
          id: maker._id,
          text: maker.sortname
        }
      });
      res.json(results);
    } catch(err) {
      next(err);
    }
  },
  createMaker: async (req, res, next) => {
    try {
      let maker = await Maker.create(req.body.maker);
      res.redirect(`/makers/${maker.slug}`);
    } catch(err) {
      next(err);
    }
  },
  showMaker: async (req, res, next) => {
    try {
      let maker = await Maker
        .findOne({ slug: req.params.slug })
        .exec();
      // let maker = await redisCache.wrap(cacheControl.createKey(req.originalUrl), function(){
      //   return getOne(req.params.slug);
      // });
      if(!maker){
        req.flash('error', 'Nope, that maker doesn\'t exist.');
        res.redirect('/makers');
      } else {
        let links = await Link
          .find( { 
            hidden: false,
            makers: maker 
          })
          .sort({ sortedtitle: 'asc'})
          .populate('makers', 'sortname slug', null, { sort: { sortname: 'asc'}})
          .populate('tags', null, null, { sort: { tag: 'asc'}})
          .exec();
        let sources = await Source
          .find( { makers: maker })
          .sort({ title: 'asc'})
          .populate('makers', 'sortname slug', null, { sort: { sortname: 'asc'}})
          .populate('tags', null, null, { sort: { tag: 'asc'}})
          .exec();
        let viewTitle = maker.sortname;
        let metaDesc = `Planning and strategy resources by ${viewTitle}.`;
        let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
        let onelink = true;
        let scriptSrc = ['/js/list.min.js', '/js/maker-show.js']
        res.render('makers/show', { onelink, maker, links, sources, viewTitle, metaDesc, metaUrl, scriptSrc });
      }
    } catch(err) {
      next(err);
    }
  },
  editMaker: async (req, res, next) => {
    try {
      let maker = await Maker
        .findOne({ slug: req.params.slug })
        .exec();
      let viewTitle = 'Edit Maker';
      let scriptSrc = ['https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js', '/js/maker-forms.js'];
      res.render('makers/edit', { maker, viewTitle, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  updateMaker: async (req, res, next) => {
    try {
      let queryOptions = {
        new: true,
        upsert: true
      };
      let makerUpdate = req.body.maker;
      cacheControl.delOne(cacheControl.createKey(slugPath(makerUpdate.slug)));
      if(makerUpdate.kind === 'Person'){
        let maker = await Person
          .findOneAndUpdate({ _id: req.params.id }, { $set: makerUpdate }, queryOptions)
          .exec();
        res.redirect(`/makers/${maker.slug}`);
      } else {
        let maker = await Organization
          .findOneAndUpdate({ _id: req.params.id }, { $set: makerUpdate }, queryOptions)
          .exec();
        res.redirect(`/makers/${maker.slug}`);
      }
    } catch(err) {
      next(err);
    }
  },
  destroyMaker: async (req, res, next) => {
    try {
      let maker = await Maker
        .findOneAndDelete({ _id: req.params.id })
        .exec();
      cacheControl.delOne(cacheControl.createKey(slugPath(maker.slug)));
      res.redirect('/makers');
    } catch(err) {
      next(err);
    }
  },
  updatePrefetch: async (req, res, next) => {
    try {
      exportMakers();
      req.flash('success', 'Makers prefetch data updated.');
      res.redirect('/makers');
    } catch(err) {
      next(err);
    }
  },
  downloadPrefetch: async (req, res, next) => {
    try {
      res.download(__dirname + '/../public/data/makers.json');
    } catch(err) {
      next(err);
    }
  }
};
async function exportMakers(){
  let makers = await Maker
    .find()
    .lean()
    .select('kind sortname slug')
    .populate('links')
    .exec();
  let data = JSON.stringify(makers);
  if(process.env.NODE_ENV === 'production'){
    fs.writeFile(__dirname + '/../public/data/makers.json', data, (err) => {
      if (err) throw (err);
      console.log('makers saved to json');
    });
  } else {
    fs.writeFile(__dirname + '/../public/data/makers-local.json', data, (err) => {
      if (err) throw (err);
      console.log('makers-local saved to json');
    });
  }
}
module.exports = makerController;