const mongoose  = require('mongoose'),
      Link      = require('./link');

// Book discriminator definition
const Book = Link.discriminator('Book',
  new mongoose.Schema({
    subkind: {
      type: String,
      trim: true,
      required: true,
      default: 'Book'
    },
    asin: {
      type: String,
      trim: true
    },
    isbn: {
      type: String,
      trim: true
    },
    published: {
      type: Date,
      required: true
    }
  }));
// Export
module.exports = mongoose.model('Book');