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

  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }
})

const Play = module.exports = mongoose.model('Play', PlaySchema);
