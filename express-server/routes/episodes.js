const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Episode = require('../models/episode');
const Play = require('../models/play');


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
    });
});

router.post('/save-track', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let b = req.body
  var play = new Play({})
  if(b.composer){
      play = new Play({
      index: b.index,
      episode: b.episode,
      show: b.show,
      startTime: b.startTime,
      endTime: b.endTime,
      artist: b.artist,
      composer: b.composer,
      title: b.title,
      classification: b.classification,
      canCon: b.canCon,
      lgbtq: b.lgbtq,
      indigenous: b.indigenous,
      album: b.album,
      year: b.year,
      label: b.label
    })
  } else if ((!b.composer) && (b.artist || b.title)){
      play = new Play({
      index: b.index,
      episode: b.episode,
      show: b.show,
      startTime: b.startTime,
      endTime: b.endTime,
      artist: b.artist,
      title: b.title,
      classification: b.classification,
      canCon: b.canCon,
      lgbtq: b.lgbtq,
      indigenous: b.indigenous,
      album: b.album,
      year: b.year,
      label: b.label
    })
  } else if ((!b.composer) && (!b.artist && !b.title)){
      play = new Play({
      index: b.index,
      episode: b.episode,
      show: b.show,
      startTime: b.startTime,
      endTime: b.endTime,
      classification: b.classification,
      canCon: b.canCon,
      lgbtq: b.lgbtq,
      indigenous: b.indigenous
    })
  }

  play.save((err, play) => {
    if (err) {
      res.json({success: false, msg: "Failed to create track"});
      console.log(err);
    } else {

      Episode.findOneAndUpdate({_id: b.episode}, {$push: {plays: play._id}})
      .exec((err, episode) => {
        if (err) {
          console.log(err)
          res.json({success: false, msg: "Failed to add track to episode"})
        } else {
          res.json({success: true, msg: "Track created successfully"})
        }
      })
    }
  });
});

router.put('/edit-track', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let b = req.body
  Play.findOneAndUpdate({"episode": b.episode, "index": b.index},
    {"$set": {
      "title": b.title,
      "artist": b.artist,
      "startTime": b.startTime,
      "endTime": b.endTime,
      "canCon": b.canCon,
      "lgbtq": b.lgbtq,
      "indigenous": b.indigenous,
      "classification": b.classification,
      "composer": b.composer,
      "album": b.album,
      "year": b.year,
      "label": b.label
    }})
    .exec((err, play) => {
      if(err){
        console.log(err)
        res.json({success: false, msg: "failed to edit track"})
      } else {
        res.json({success: true, msg: "Track successfully edited"})
      }
    });
});

router.delete('/delete-track/:episode/:index', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Play.findOneAndRemove({episode: req.params.episode, index: req.params.index}, (err, play) => {
    if (err){
      console.log(err);
      res.json({success: false, msg: "Failed to delete track"})
    } else {

      res.json({success: true, msg: "Track successfully deleted"})
    }
  });
});

router.get('/get-upcoming-episodes/:id', (req, res, next) => {
  Episode.find({endDate: {$gt: Date.now()}, show: req.params.id})
    .sort({endDate: 1})
    .then(episodes => {
      res.send(episodes);
    });
});

router.get('/get-current-episode', (req, res, next) => {
  Episode.findOne({endDate: {$gt: Date.now()}, airDate: {$lt: Date.now()}})
    .populate('plays')
    .populate('show')
    .then((episode, err) => {
      if(err){
        console.log(err)
        res.send(500, 'something went wrong')
      } else if (episode){
        res.send(episode);
      } else {
        res.json({success: false, msg: 'No Episode was found'});
      }
    })
})

router.get('/get-past-episodes/:id', (req, res, next) => {
  Episode.find({endDate: {$lt: Date.now()}, show: req.params.id})
    .sort({endDate: 1})
    .then(episodes => {
      res.send(episodes)
    });
});

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Play.remove({episode: req.params.id}, (err, play) => {
    if (err) {
      res.json({success: false, msg: 'Could not delete associated tracks'})
      console.log(err)
      return false
    } else {
    }
  })

  Episode.findOneAndRemove({_id: req.params.id}, (err, episode) => {
    if(err) {
      res.json({success: false, msg: 'Could not delete episode'});
      console.log(err);
    } else {
      res.json({success: true, msg: 'Episode and tracks deleted'});
    }
  })
})

router.get('/get-episode/:id', (req, res, next) => {
  Episode.findOne({_id: req.params.id})
    .populate('plays')
    .then((episode, err) => {
      if (err){
        console.log(err)
        res.json({success: false, msg: 'Could not retrieve episode'})
      } else {
        res.send(episode)
      }
    })
})

module.exports = router;
