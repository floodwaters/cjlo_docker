const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const multer = require('multer');
const Jimp = require('jimp');
const Promise = require('bluebird');
const fileType = require('file-type');
const fs = require('fs-extra');
const Ad = require('../models/ad');

//creates an ad
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let newAd = new Ad({
    title: req.body.title,
    link: req.body.link,
    slot: req.body.slot,
    imagePath: req.body.imagePath
  });

  newAd.save((err, ad) => {
    if(err){
      res.json({success: false, msg: 'Failed to save ad'})
      console.log(err)
    } else {
      res.json({success: true, msg: 'Ad successfully saved'})
    }
  });
});


var imageStorage = multer.memoryStorage();
var imageUpload = multer({storage: imageStorage});


//saves an image to the ad folder
router.post('/image', imageUpload.single('file'), passport.authenticate('jwt', {session: false}), (req, res, next) => {
  var rand = Math.floor(Math.random() * 200000).toString()

  if (req.body.slot === 'Bottom'){

    Jimp.read(req.file.buffer, (err, image) => {
      if(err){
        res.json({success: false, msg: 'Could not save image'})
      } else {
        image.resize(728, 90);
        image.write('./public/ads/' + rand + req.file.originalname);
        res.json({success: true, path: 'public/ads/' + rand + req.file.originalname});
      }

    });

  } else if (req.body.slot === 'Side'){

    Jimp.read(req.file.buffer, (err, image) => {
      if(err){
        res.json({success: false, msg: 'Could not save image'})
      } else {
      image.resize(250, 250);
      image.write('./public/ads/' + rand + req.file.originalname);
      res.json({success: true, path: 'public/ads/' + rand + req.file.originalname});
      }
    });
  }
});

//delete an image from the database
router.post('/delete-image', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  fs.unlink(req.body.path);
  res.json({success: true, msg: 'Image has been deleted'});
});

//delete an ad from the database
router.post('/delete-ad/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Ad.findOne({_id: req.params.id})
    .then((ad) => {
      fs.unlink(ad.imagePath);
    });
  Ad.findByIdAndRemove({_id: req.params.id})
    .then((err, ad) => {
      if(err) {
        res.json({success: false, msg: 'Could not delete ad'});
      } else {
        res.json({success: true, ms: 'Ad has been deleted'});
      }
    });
});

//edit an ad
router.put('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Ad.findOneAndUpdate({_id: req.params.id}, {$set: {'title': req.body.title, 'link': req.body.link, 'imagePath': req.body.imagePath, 'slot': req.body.slot}})
    .then((err, ad) => {
      if (err){
        console.log(err);
        res.json({success: false, msg: 'Could not edit ad'});
      } else {
        res.json({success: true, msg: 'Ad has been edited'});
      }
    });
});

//increment clicks
router.put('/increment/:id', (req, res, next) => {
  Ad.findOneAndUpdate({_id: req.params.id}, {$inc: { 'clicks': 1}})
    .then((ad) => {
      res.json({success: true, msg: 'Incremented clicks!'});
    });
});

//activate ad
router.put('/active/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Ad.findOneAndUpdate({_id: req.params.id}, {$set: { 'active': req.body.active}})
    .then((ad) => {
      res.json({success: true, msg: 'Changed active status of ad'});
    });
});

//get an ad by slot
router.post('/get', (req, res, next) => {
  Ad.findOne({active: true, slot: req.body.slot})
    .then((ad) => {
      res.send(ad);
    });
});

//get ad by id
router.get('/get-ad/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Ad.findOne({_id: req.params.id})
    .then((ad) => {
        res.send(ad);
    });
});

//get all ads
router.get('/get-all', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Ad.find({})
    .then((ads, err) => {
      if (err) {
        console.log(err);
        res.json({success: false, msg: 'Could not retrieve ads'});
      } else {
        res.send(ads);
      }
    })
    .catch(next);
});

module.exports = router;
