const   mongoose  = require('mongoose'),
    slugify   = require('slugify');

const options = {
  timestamps: true
};

// Schema definition

const sourceSchema = new mongoose.Schema({
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
  url: {
    type: String,
    required: true,
    trim: true
  },
  published: {
    type: Date
  },
  slug: {
    type: String,
    trim: true
  },
  sortedtitle: {
    type: String,
    trim: true
  }
}, options);

// Temporary fix? Virtual getter for sorttitle... bc virtual, will not alphabetize ahead of time
// Adapted from https://stackoverflow.com/questions/34347008/how-can-i-sort-a-javascript-array-while-ignoring-articles-a-an-the

const sortTitleVirtual = sourceSchema.virtual('sorttitle');

sortTitleVirtual
  .get(function(){
    let sortTitle = this.title;
    let words = sortTitle.toLowerCase().split(' ');
    if(words.length <= 1){
      return sortTitle;
    }
    if(words[0] === 'a' || words[0] === 'an' || words[0] === 'the'){
      sortTitle = words.splice(1).join(' ');
      return sortTitle;
    }
    return sortTitle;   
  });

// For list.js: Virtual getter for all makers in one field

const allMakersVirtual = sourceSchema.virtual('allmakers');

allMakersVirtual
  .get(function(){
    let allMakers = [];
    this.makers.forEach((maker) => {
      allMakers.push(maker.sortname);
    });
    return allMakers;
  });

// Pre-save slugify
sourceSchema.pre('save', async function(){
  try {
    const Source = this.constructor;
    let shortTitle = this.title.split(":")[0];
    let slug = await slugify(shortTitle, { lower: true, remove: /[*+~.()'",—!/?:@]/g });
    // only check for matching slugs if new document
    if (this.isNew) { 
      let matchingSlugs = await Source.find({ slug: { $regex: new RegExp('^' + slug, 'i') }});
      // if no matching slugs, assign default slug
      if (matchingSlugs.length === 0){
        this.slug = slug;
      // otherwise assign the custom slug
      } else {
        this.slug = slug + '-' +  this._id.toString().substr(18, 6);
      }
    }
  } catch(err) {
    next(err);
  }
});

// Pre-save sortedtitle
sourceSchema.pre('save', async function(){
  try {
    const Source = this.constructor;
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

module.exports = mongoose.model('Source', sourceSchema);