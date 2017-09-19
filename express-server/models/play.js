const mongoose = require('mongoose');
const config = require('../config/database');
const Show = require('./show');
const Episode = require('./episode');

const PlaySchema = mongoose.Schema({

  startTime: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date
  },

  episode: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  show: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  classification: {
    type: String,
    required: true
  },

  composer: {
    type: String
  },

  duration: {
    type: String
  },

  artist: {
    type: String
  },

  title: {
    type: String
  },

  index: {
    type: Number
  },

  new: {
    type: Boolean,
    required: true,
    default: false
  },

  canCon: {
    type: Boolean,
    default: false,
    required: true
  },

  lgbtq: {
    type: Boolean,
    default: false,
    required: true
  },

  indigenous: {
    type: Boolean,
    default: false,
    required: true
  }
})

const Play = module.exports = mongoose.model('Play', PlaySchema);
