const mongoose = require('mongoose');
const config = require('../config/database');
const Show = require('./show');

const EpisodeSchema = mongoose.Schema({

  body: {
    type: String
  },

  airDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },

  plays: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Play'
  }],

  filePath: {
    type: String
  }
})

//exports the model for the EpisodeSchema
const Episode = module.exports = mongoose.model('Episode', EpisodeSchema);

//enables searching for episode by ID
module.exports.getEpisodeById = (id, callback) => {
  Episode.findById(id, callback);
};
