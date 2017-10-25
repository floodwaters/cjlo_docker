const mongoose = require('mongoose');
const config = require('../config/database');
const Entry = require('./chart-entry');

const chartSchema = mongoose.Schema({

  classification: {
    type: String,
    enum: ['Top 30', 'Adds', 'Hip-Hop', 'Hip-Hop Adds', 'RPM', 'RPM Adds', 'Metal', 'Metal Adds', 'World', 'World-Adds']
  },

  week: {
    type: String
  },

  entries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry'
  }]

});

const Chart = module.exports = mongoose.model('Chart', chartSchema);
