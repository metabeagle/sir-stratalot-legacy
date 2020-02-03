const Link  = require('../models/link/link'),
      Maker = require('../models/maker/maker'),
      Tag   = require('../models/tag/tag');

const indexController = {
  getIndex: async (req, res, next) => {
    try {
      let linkCount = await Link
        .estimatedDocumentCount();
      let newLinks = await Link
        .find({ hidden: false }, '-sources -description')
        .sort({ createdAt: 'desc'})
        .limit(10)
        .populate('makers', 'sortname', null, { sort: { sortname: 'asc' } })
        .exec();
      let popularLinks = await Link
        .find({ hidden: false }, '-sources -description')
        .sort({ likes: 'desc'})
        .limit(10)
        .populate('makers', 'sortname', null, { sort: { sortname: 'asc' } })
        .exec();
      let recommendedTags = await Tag
        .find({ featured: true})
        .populate('count')
        .sort({ tag: 'asc'})
        .limit(15)
        .exec();
      let metaDesc = 'Sir Stratalot is a growing directory of planning and strategy links. Articles, books, reports, research, tools, communities, and more. Serving the advertising and marketing community since 2019.';
      let metaUrl = 'https://' + req.get('host') + req.originalUrl.replace(/\/$/, '');
      let scriptSrc = ['https://cdnjs.cloudflare.com/ajax/libs/corejs-typeahead/1.2.1/typeahead.bundle.min.js', '/js/bloodhound.js'];
      res.render('index', { linkCount, newLinks, popularLinks, recommendedTags, metaDesc, metaUrl, scriptSrc });
    } catch(err) {
      next(err);
    }
  }
}
module.exports = indexController;