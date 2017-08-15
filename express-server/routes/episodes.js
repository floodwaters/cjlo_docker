const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Episode = require('../models/episode');
const Play = require('../models/play');
const Track = require('../models/track');

//create a new episode
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let newEpisode = new Episode({
    airDate: req.body.airDate,
    show: req.body.show,
    endDate: req.body.endDate,
  });

  newEpisode.save((err, episode) => {
    if (err) {
      res.json({success: false, msg: "Failed to create episode"});
      console.log(err);
    } else {
      res.json({success: true, msg: "Episode created successfully", id: episode._id})
    }
  });
});

router.put('/body', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let id = req.body.show
  Episode.findByIdAndUpdate({_id: id}, {$set: {"body": req.body.body}})
    .then((episode, err) => {
      if(err){
        res.json({success: false, msg: 'Failed to save episode description'})
        console.log(err);
      } else {
        res.json({success: true, msg: "Episode description saved successfully"})
      }
    })
})

module.exports = router;
