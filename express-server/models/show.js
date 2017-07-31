const mongoose = require('mongoose');
const config = require('../config/database');
const User = require('./user');


const ShowSchema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  djs: [{
    dj: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  description: {
    type: String,
    required: true
  },

  thumbnailPath: {
    type: String
  },

  imagePath: {
    type: String
  }

  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },

  time: {
    type: String
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date
  },

  duration: {
    type: String,
    enum: ['1 hr', '1/2 hr', '2 hr']
  },

  type: {
    type: String,
    enum: ['Weekly', 'Bi-Weekly', 'One-off']
  },

  tags: [{
    type: String
  }],

  onAir: {
    type: Boolean,
    required: true
  }
});

//exports the model for the ShowSchema
const Show = module.exports = mongoose.model('Show', ShowSchema);

//enables searching for show by ID
module.exports.getShowById = (id, callback) => {
  Show.findById(id, callback);
};
