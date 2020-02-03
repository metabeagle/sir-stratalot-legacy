const mongoose = require('mongoose');

const options = {
  timestamps: true,
  new: true,
  upsert: true,
  setDefaultsOnInsert: true
};

// Schema definition
const nomineeSchema = new mongoose.Schema({
  kind: {
    type: String,
    required: true,
    trim: true,
    default: function(){
      if(this.subkind === 'Book'){
        return 'Book';
      } else if(this.subkind === 'Article' || this.subkind === 'Presentation' || this.subkind === 'Report' || this.subkind === 'Video'){
        return 'Single';
      } else if(this.subkind === 'Blog' || this.subkind === 'Newsletter' || this.subkind === 'Podcast'){
        return 'Feed';
      } else if(this.subkind === 'Meta' || this.subkind === 'Reference' || this.subkind === 'Research'){
        return 'Resource';
      } else if(this.subkind === 'Research Tool' || this.subkind === 'Service' || this.subkind === 'Toolkit' || this.subkind === 'Utility'){
        return 'Tool';
      } else if(this.subkind === 'Community' || this.subkind === 'Education' || this.subkind === 'Opportunity'){
        return 'Extracurricular';
      } else {
        return 'Other';
      }
    }
  },
  subkind: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  makers: [{
    type: String,
    required: true,
    trim: true
  }],
  url: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  likes: {
    type: Number,
    required: true,
    default: 0
  },
  winner: {
    type: Boolean,
    required: true,
    default: false
  },
  sortedtitle: {
    type: String,
    trim: true
  }
}, options);

// Like & unlike methods
nomineeSchema.methods.like = function() {
  this.likes++;
  return this.save();
};
nomineeSchema.methods.unlike = function() {
  this.likes--;
  return this.save();
};

// Temporary fix? Virtual getter for sorttitle... bc virtual, will not alphabetize ahead of time
// Adapted from https://stackoverflow.com/questions/34347008/how-can-i-sort-a-javascript-array-while-ignoring-articles-a-an-the
const sortTitleVirtual = nomineeSchema.virtual('sorttitle');
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
const allMakersVirtual = nomineeSchema.virtual('allmakers');
allMakersVirtual
  .get(function(){
    let allMakers = [];
    this.makers.forEach((maker) => {
      allMakers.push(maker);
    });
    return allMakers;
  });

// Pre-save sortedtitle
nomineeSchema.pre('save', async function(){
  try {
    const Nominee = this.constructor;
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
module.exports = mongoose.model('Nominee', nomineeSchema);