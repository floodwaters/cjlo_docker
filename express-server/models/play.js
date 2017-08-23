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

  album: {
    type: String
  },

  year: {
    type: String
  },

  label: {
    type: String
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
