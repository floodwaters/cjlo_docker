const mongoose = require('mongoose');
const config = require('../config/database');

const TrackSchema = mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  artist: {
    type: String,
    required: true
  },

  composer: {
    type: String
  },

  duration: {
    type: String
  }
});

const Track = module.exports = mongoose.model('Track', TrackSchema);
