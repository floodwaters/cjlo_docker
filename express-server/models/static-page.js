const mongoose = require('mongoose');
const config = require('../config/database');



//defines the database schema for articles
const ArticleSchema = mongoose.Schema({
  title: {
    type: String
  },

  body: {
    type: String
  },

  published: {
    type: Boolean,
    required: true,
    default: false
  }

});

//exports the model for articles
const StaticPage = module.exports = mongoose.model('StaticPage', ArticleSchema);
