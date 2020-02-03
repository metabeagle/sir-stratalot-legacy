const 	mongoose 	= require('mongoose'),
		slugify		= require('slugify');

const options = {
	timestamps: true,
	toObject: { virtuals: true }, 
	toJSON: { virtuals: true }
};

// Schema definition

const tagSchema = new mongoose.Schema({
	tag: {
		type: String,
		required: true,
		lowercase: true,
		trim: true
	},
	slug: {
		type: String,
		trim: true
	},
	featured: {
		type: Boolean,
		default: false
	}
}, options);

// Count virtual (# of links with this tag)

tagSchema.virtual('count', {
	ref: 'Link',
	localField: '_id',
	foreignField: 'tags',
	count: true
});

// Pre-save slugify
tagSchema.pre('save', async function(){
  try {
    const Tag = this.constructor;
    let slug = await slugify(this.tag, { lower: true, remove: /[*+~.()'",—!/?:@]/g });
    // only check for matching slugs if new document
    if (this.isNew) {
      let matchingSlugs = await Tag.find({ slug: { $regex: new RegExp('^' + slug, 'i') }});
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

// Export

module.exports = mongoose.model('Tag', tagSchema);