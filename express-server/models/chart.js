const mongoose = require('mongoose');
const config = require('../config/database');

const chartSchema = mongoose.Schema({

  classification: {
    type: String,
    enum: ['Top 30', 'Ads', 'Hip-Hop', 'Hip-Hop Ads', 'RPM', 'RPM Ads', 'Metal', 'Metal Ads', 'World', 'World Ads']
  },

  week: {
    type: String
  },

  entries: [{

  }]

});

const Chart = module.exports = mongoose.model('Chart', chartSchema);
