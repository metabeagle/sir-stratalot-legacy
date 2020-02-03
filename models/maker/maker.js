const   mongoose  = require('mongoose'),
    slugify   = require('slugify'),
    Channel   = require('./channel');

const options = {
  discriminatorKey: 'kind',
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
};

// Schema definition

const makerSchema = new mongoose.Schema({
  sortname: {
    type: String,
    // Sort makers by first name if person, organization name otherwise
    default: function(){
      if(this.kind === 'Person'){
        return `${this.first} ${this.last}`;
      } else {
        return this.name;
      }
    }
  },
  slug: {
    type: String,
    trim: true
  },
  channels: [Channel.schema],
  // Description serves eventuality of letting makers edit their own bio...
  description: {
    type: String,
    trim: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
  // user: {
  //  type: mongoose.Schema.Types.ObjectId,
  //  ref: 'User'
  // }
}, options);

// Virtual fields for easier populate when viewing a maker (if needed)
// Maybe I won't need this? To re-evaluate.

makerSchema.virtual('sources', {
  ref: 'Source',
  localField: '_id',
  foreignField: 'makers',
  count: true
});

makerSchema.virtual('links', {
  ref: 'Link',
  localField: '_id',
  foreignField: 'makers',
  count: true
});

// Full name virtual for Person discriminator only

const fullNameVirtual = makerSchema.virtual('fullname');

fullNameVirtual
  .get(function(){
    return this.first + ' ' + this.last;
  });

// Pre-save slugify
// Maybe: Create a separate generateSlug method?
makerSchema.pre('save', async function(){
  try {
    const Maker = this.constructor;
    let slug = await slugify(this.sortname, { lower: true, remove: /[*+~.()'",—!/?:@]/g });
    // only check for matching slugs if new document
    if (this.isNew) {
      let matchingSlugs = await Maker.find({ slug: { $regex: new RegExp('^' + slug, 'i') }});
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

// Pre or post-update slugify?
// Not doing this; maker url slugs will not change if name is edited.

// Export Maker model

module.exports = mongoose.model('Maker', makerSchema);