const mongoose = require('mongoose');
const config = require('../config/database');
const Show = require('./show');

const DaySchema = mongoose.Schema({

  one : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  two : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  three : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  four : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  five : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  six : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  seven : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  eight : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  nine : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  ten : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  eleven : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twelve : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirteen : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fourteen : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fifteen : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  sixteen : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  seventeen : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  eighteen : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  nineteen : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twenty : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twentyone : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twentytwo : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twentythree : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twentyfour : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twentyfive : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twentysix : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twentyseven : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twentyeight : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  twentynine : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirty : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirtyone : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirtytwo : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirtythree : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirtyfour : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirtyfive : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirtysix : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirtyseven : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirtyeight : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  thirtynine : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fourty : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fourtyone : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fourtytwo : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fourtythree : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fourtyfour : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fourtyfive : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fourtysix : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fourtyseven : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }],

  fourtyeight : [{
    show {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  }]
})

//export the model for the Friday schema
const Friday = module.exports = mongoose.model('Friday', DaySchema)
