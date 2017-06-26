const mongoose = require('mongoose');
const config = require('../config/database');


//defines the database schema for articles
const ArticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  articleBody: {
    type: String,
    required: true
  },

  created_at: {
    type: Date,
    required: true
  },

  published: {
    type: Boolean,
    required: true
  },

  publish_on: {
    type: Date
  },

  unpublish_on: {
    type: Date
  },

  highlighted: {
    type: Boolean,
    required:true,
    default: false
  }

});

//exports the model for articles
const Article = module.exports = mongoose.model('article', ArticleSchema);

//enables seaerching for articles by ID
module.exports.getArticleById = (id, callback) => {
  Article.findById(id, callback);
};
