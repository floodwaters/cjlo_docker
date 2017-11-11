const mongoose = require('mongoose');
const config = require('../config/database');

const adSchema = mongoose.Schema({

  link: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  slot: {
    type: String,
    required: true,
    enum: ['Side', 'Bottom']
  },

  imagePath: {
    type: String,
    required: true
  },

  clicks: {
    type: Number,
    required: true,
    default: 0
  },

  active: {
    type: Boolean,
    required: true,
    default: false
  }

});

const Entry = module.exports = mongoose.model('Ad', adSchema);
