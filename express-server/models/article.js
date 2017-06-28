const mongoose = require('mongoose');
const config = require('../config/database');


//defines the database schema for articles
const ArticleSchema = mongoose.Schema({
  title: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  articleBody: {
    type: String
  },

  created_at: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ['draft', 'published', 'unpublished', 'review'],
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
const Article = module.exports = mongoose.model('Article', ArticleSchema);

//enables seaerching for articles by ID
module.exports.getArticleById = (id, callback) => {
  Article.findById(id, callback);
};
