const mongoose = require('mongoose');
      keys   = require('./keys');

const options = { 
      useNewUrlParser: true,
      useFindAndModify: false
};
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, options);
module.exports = mongoose;