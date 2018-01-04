const mongoose = require('mongoose');
const config = require('../config/database');
const User = require('./user');




var ShowSchema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  tags: [{
    type: String
  }],

  djs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }],

  description: {
    type: String,
    required: true
  },

  thumbnailPath: {
    type: String
  },

  bannerPath: {
    type: String
  },

  startDay: {
    type: Number,
    required: true
  },

  startHour: {
    type: Number,
    required: true
  },

  startMinute: {
    type: Number,
    required: true
  },

  endDay: {
    type: Number,
    required: true
  },

  endHour: {
    type: Number,
    required: true
  },

  endMinute: {
    type: Number,
    required: true
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
    enum: ['1 hr', '1/2 hr', '2 hr', '3 hr']
  },

  type: {
    type: String,
    enum: ['Weekly', 'Bi-weekly', 'One-off']
  },

  onAir: {
    type: Boolean,
    required: true,
    default: false
  },

  archive: {
    type: Boolean,
    required: true,
    default: false
  },

  timeString: {
    type: String
  },

  placeholder: {
    type: Boolean,
    required: true,
    default: false
  }
});



//exports the model for the ShowSchema
const Show = module.exports = mongoose.model('Show', ShowSchema);

//enables searching for show by ID
module.exports.getShowById = (id, callback) => {
  Show.findById(id, callback);
};
