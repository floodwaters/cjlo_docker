const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Play = require('../models/play');

router.get('/get-current-track', (req, res, next) => {
  Play.findOne({startTime: {$lt: Date.now()}, endTime: {$gt: Date.now()}})
    .then((play, err) => {
      if (err){
        console.log(err)
        res.json({success: false, msg: 'Something went wrong'})
      } else if (play == null) {
        res.json({success: false, msg: 'Could not find a track to play'})
      } else {
        res.send(play)
      }
    });
});

router.post('/get-playlist', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Play.find({startTime: {$gt: new Date(req.body.start)}, endTime: {$lt: new Date(req.body.end)}})
    .sort('startTime')
    .then((plays, err) => {
      if(err){
        res.json({success: false, msg: 'Something went wrong'});
      } else if (plays == null){
        res.json({success: false, msg: 'No tracks to display'});
      } else {
        res.send(plays)
      }
    });
});

router.post('/get-chart', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Play.find({$or: [{'classification': 'Theme'}, {'classification': 'Background'}], startTime: {$gt: new Date(req.body.start)}, endTime: {$lt: new Date(req.body.end)}})
    .sort('artist')
    .then((plays, err) => {
      if(err){
        console.log(err)
        res.json({success: false, msg: 'Something went wrong'});
      } else if (plays == null){
        res.json({success: false, msg: 'No tracks to display'});
      } else {
        res.send(plays)
      }
    })
})

module.exports = router;
