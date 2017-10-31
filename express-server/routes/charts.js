const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Chart = require('../models/chart');


//save a chart to the database
router.post('/save', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Chart.remove({classification: req.body.classification}, (err) => {
    if (err) {
      console.log(err)
    }
  });

  let newChart = new Chart ({
    classification: req.body.classification,
    week: req.body.week,
    entries: req.body.entries
  });

  newChart.save((err, chart) => {
    if(err){
      res.json({success: false, msg: 'Failed to save chart'});
      console.log(err)
    } else {
      res.json({success: true, msg: 'Chart saved!'})
    }
  });

});

//get charts
router.post('/get-chart', (req, res, next) => {
  Chart.findOne({classification: req.body.classification})
    .then((chart, err) => {
      if (err){
        res.json({success: false, msg: err});
      } else {
        res.send(chart);
      }
    });
});

module.exports = router;
