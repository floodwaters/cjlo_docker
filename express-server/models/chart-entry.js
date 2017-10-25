const mongoose = require('mongoose');
const config = require('../config/database');

const entrySchema = mongoose.Schema({

  Artist: {
    type: String
  },

  Title: {
    type: String
  },

  Label: {
    type: String
  },

});

const Entry = module.exports = mongoose.model('Entry', entrySchema);
