const mongoose = require("mongoose");

const options = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
};

const channelSchema = new mongoose.Schema({
  kind: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  }
}, options);

// Virtual getter for FontAwesome icon per channel
// Better than saving to database; easier to fix icons if FontAwesome makes changes

const icon = channelSchema.virtual('icon');

icon
  .get(function(){
    if (this.kind === 'Blog') {
      return 'fas fa-rss';
    } else if (this.kind === 'Facebook') {
      return 'fab fa-facebook';
    } else if (this.kind === 'Google') {
      return 'fab fa-google';
    } else if (this.kind === 'LinkedIn') {
      return 'fab fa-linkedin'; 
    } else if (this.kind === 'Medium') {
      return 'fab fa-medium-m';
    } else if (this.kind === 'Newsletter') {
      return 'far fa-envelope';
    } else if (this.kind === 'Podcast') {
      return 'far fa-podcast';
    } else if (this.kind === 'Slack') {
      return 'fab fa-slack';
    } else if (this.kind === 'Slideshare') {
      return 'fab fa-slideshare';
    } else if (this.kind === 'Tumblr') {
      return 'fab fa-tumblr';
    } else if (this.kind === 'Twitter') {
      return 'fab fa-twitter';
    } else if (this.kind === 'Website') {
      return 'far fa-globe';
    } else if(this.kind === 'Wikipedia') {
      return 'fab fa-wikipedia-w';
    } else if(this.kind === 'YouTube') {
      return 'fab fa-youtube';
    } else {
      return 'far fa-link';
    }
  });

module.exports = mongoose.model('Channel', channelSchema);