const mongoose    = require('mongoose'),
      slugify     = require('slugify');
      Attribution = require('./attribution');

const options = {
  discriminatorKey: 'kind',
  timestamps: true,
  new: true,
  upsert: true,
  // setDefaultsOnInsert: true,
  toObject: { virtuals: true }, 
  toJSON: { virtuals: true }
};

// Schema definition
const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  makers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maker',
    required: true
  }],
  description: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true,
    lowercase: true
  }],
  url: {
    type: String,
    required: true,
    trim: true
  },
  sources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Source'
  }],
  attribution: {
    type: Attribution.schema,
    trim: true
  },
  slug: {
    type: String,
    trim: true
  },
  likes: {
    type: Number,
    default: 0
  },
  flags: {
    type: Number,
    default: 0
  },
  imgurl: {
    type: String,
    trim: true
  },
  logourl: {
    type: String,
    trim: true
  },
  hidden: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sortedtitle: {
    type: String,
    trim: true
  },
  amazon: {
    type: Boolean,
    default: false
  }
}, options);

// Like & unlike methods
linkSchema.methods.like = function() {
  this.likes++;
  return this.save();
};
linkSchema.methods.unlike = function() {
  this.likes--;
  return this.save();
};

// Flag method
linkSchema.methods.flag = function() {
  this.flags++;
  return this.save();
};

// Temporary fix? Virtual getter for sorttitle... bc virtual, will not alphabetize ahead of time
// Adapted from https://stackoverflow.com/questions/34347008/how-can-i-sort-a-javascript-array-while-ignoring-articles-a-an-the
// const sortTitleVirtual = linkSchema.virtual('sorttitle');
// sortTitleVirtual
//   .get(function(){
//     let sortTitle = this.title;
//     let words = sortTitle.toLowerCase().split(' ');
//     if(words.length <= 1){
//       return sortTitle;
//     }
//     if(words[0] === 'a' || words[0] === 'an' || words[0] === 'the'){
//       sortTitle = words.splice(1).join(' ');
//       return sortTitle;
//     }
//     return sortTitle;
//   });

// For list.js: Virtual getter for all makers in one field
const allMakersVirtual = linkSchema.virtual('allmakers');
allMakersVirtual
  .get(function(){
    let allMakers = [];
    this.makers.forEach((maker) => {
      allMakers.push(maker.sortname);
    });
    return allMakers;
  });

// For list.js: Virtual getter for all tags in one field
const allTagsVirtual = linkSchema.virtual('alltags');
allTagsVirtual
  .get(function(){
    let allTags = [];
    this.tags.forEach((tag) => {
      allTags.push(tag.tag);
    });
    return allTags;
  });

// Pre-save slugify
linkSchema.pre('save', async function(){
  try {
    const Link = this.constructor;
    let shortTitle = this.title.split(":")[0];
    let slug = await slugify(shortTitle, { lower: true, remove: /[*+~.()'",—!/?:@]/g });
    // only check for matching slugs if new document
    if (this.isNew) {
      let matchingSlugs = await Link.find({ slug: { $regex: new RegExp('^' + slug, 'i') }});
      // if no matching slugs, assign default slug
      if (matchingSlugs.length === 0){
        this.slug = slug;
      // otherwise assign the custom slug
      } else {
        this.slug = slug + '-' +  this._id.toString().substr(18, 6);
      }
    }
    // no add'l else statement needed?
  } catch(err) {
    next(err);
  }
});

// Pre-save sortedtitle
linkSchema.pre('save', async function(){
  try {
    const Link = this.constructor;
    const sortTitle = await this.title.toLowerCase();
        const words = await sortTitle.split(' ');
        if(words.length <= 1){
          this.sortedtitle = sortTitle;
        } else if(words[0] === 'a' || words[0] === 'an' || words[0] === 'the'){
          this.sortedtitle = words.splice(1).join(' ');
        } else {
          this.sortedtitle = sortTitle;
        }
  } catch(err) {
    next(err);
  }
});

// Export
module.exports = mongoose.model('Link', linkSchema);