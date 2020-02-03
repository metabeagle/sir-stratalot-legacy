const   Tag   = require('../models/tag/tag'),
        Maker   = require('../models/maker/maker'),
        Source  = require('../models/source/source'),
        Link  = require('../models/link/link'),
        fs    = require('fs');

const { redisCache, cacheControl } = require('../services/cache-control');

function slugPath(slug){
  return `/tags/${slug}`;
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

const tagController = {
  getTags: async (req, res, next) => {
    try {
      let tags = await Tag
        .find()
        .populate('count')
        .sort({ tag: 'asc'})
        .exec();
      let viewTitle = 'Tags';
      let metaDesc = 'Explore planning and strategy resources by tag, topic, or keyword.';
      let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
      let scriptSrc = ['/js/list.min.js', '/js/tag-index.js'];
      res.render('tags/index', { tags, viewTitle, metaDesc, metaUrl, scriptSrc });
    } catch(err) {
      next(err);
    }
  },
  updatePrefetch: async (req, res, next) => {
    try {
      exportTags();
      req.flash('success', 'Tags prefetch data updated.');
      res.redirect('/tags');
    } catch(err) {
      next(err);
    }
  },
  downloadPrefetch: async (req, res, next) => {
    try {
      res.download(__dirname + '/../public/data/tags.json');
    } catch(err) {
      next(err);
    }
  },
  newTag: async (req, res, next) => {
    try {
      let viewTitle = 'New Tag';
      res.render('tags/new', { viewTitle });
    } catch(err) {
      console.log('Error:', err);
    }
  },
  searchTags: async (req, res, next) => {
    try {
      let regex = await new RegExp(req.query.term, 'i');
      let query = await Tag.find({ tag: regex }).sort({ tag: 'asc' }).exec();
      let results = await query.map((tag) => {
        return {
          id: tag._id,
          text: tag.tag
        }
      });
      res.json(results);
    } catch(err) {
      next(err);
    }
  },
  createTag: async (req, res, next) => {
    try {
      // Find a smarter way to move this 'check if valid' logic elsewhere?
      let possibleTag = req.body.tag;
      let invalidTag = await Tag.findOne({ tag: possibleTag.tag });
      if(invalidTag){
        req.flash('error', 'Hmm, looks like that tag already exists.');
        res.redirect('/tags/new');
      } else {
        let tag = await Tag.create(req.body.tag);
        // exportTags();
        res.redirect(`/tags/${tag.slug}`);
      }
    } catch(err) {
      next(err);
    }
  },
  showTag: async (req, res, next) => {
    try {
      let tag = await Tag
        .findOne({ slug: req.params.slug })
        .exec();
      if(!tag){
        req.flash('error', 'Nope, that tag doesn’t exist.');
        res.redirect('/tags');
      } else {
        let links = await Link
          .find({ 
            hidden: false,
            tags: tag
          })
          .sort({ sortedtitle: 'asc'})
          .populate('makers', 'sortname slug', null, { sort: { sortname: 'asc'}})
          .populate('tags', null, null, { sort: { tag: 'asc'}})
          .exec();
        let viewTitle = tag.tag;
        let metaDesc = `Planning and strategy resources tagged “${viewTitle}”.`;
        let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
        let onelink = true;
        let scriptSrc = ['/js/list.min.js', '/js/tag-show.js'];
        res.render('tags/show', { onelink, tag, links, viewTitle, metaDesc, metaUrl, scriptSrc });
      }
    } catch(err) {
      next(err);
    }
  },
  editTag: async (req, res, next) => {
    try {
      let tag = await Tag
        .findOne({ slug: req.params.slug })
        .exec();
      let viewTitle = 'Edit Tag';
      res.render('tags/edit', { tag, viewTitle });
    } catch(err) {
      next(err);
    }
  },
  updateTag: async (req, res, next) => {
    try {
      let queryOptions = {
        new: true,
        upsert: true
      };
      let tagUpdate = req.body.tag;
      cacheControl.delOne(cacheControl.createKey(slugPath(tagUpdate.slug)));
      let tag = await Tag
        .findOneAndUpdate({ _id: req.params.id }, { $set: tagUpdate }, queryOptions)
        .exec();
        res.redirect(`/tags/${tag.slug}`);
    } catch(err) {
      next(err);
    }
  },
  destroyTag: async (req, res, next) => {
    try {
      let tag = await Tag
        .findOneAndDelete({ _id: req.params.id })
        .exec();
      cacheControl.delOne(cacheControl.createKey(slugPath(tag.slug)));
      res.redirect('/tags');
    } catch(err) {
      next(err);
    }
  },
  setFeatured: async (req, res, next) => {
    try {
      let tag = await Tag
        .findOne({ slug: req.params.slug })
        .exec();
      tag.featured = !tag.featured;
      tag.save();
      res.redirect(`/tags/${tag.slug}`);
    } catch(err) {
      next(err);
    }
  }
}
async function exportTags(){
  let tags = await Tag
    .find()
    .lean()
    .select('tag slug')
    .populate('count')
    .exec();
  let data = JSON.stringify(tags);
  if(process.env.NODE_ENV === 'production'){
    fs.writeFile(__dirname + '/../public/data/tags.json', data, (err) => {
      if (err) throw (err);
      console.log('tags saved to json');
    });
  } else {
    fs.writeFile(__dirname + '/../public/data/tags-local.json', data, (err) => {
      if (err) throw (err);
      console.log('tags-local saved to json');
    });
  }
}
module.exports = tagController;