const mongoose = require("mongoose");

const options = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
};

const attributionSchema = new mongoose.Schema({
  label: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  }
}, options);

module.exports = mongoose.model('Attribution', attributionSchema);