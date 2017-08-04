const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Article = require('../models/article');
const Show = require('../models/show');
const multer = require('multer');
const Jimp = require('jimp');
const Promise = require('bluebird');
const fileType = require('file-type');

//create show
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  var timeSlots = req.body.timeSlots
  var Djs = req.body.djs
  var Days = req.body.days


  let newShow = new Show({
    name: req.body.name,
    timeslots: timeSlots,
    djs: Djs,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    days: Days,
    timeString: req.body.timeString,
    type: req.body.type,
    duration: req.body.duration,
    tags: req.body.tags,
    thumbnailPath: req.body.thumbnailPath,
    bannerPath: req.body.bannerPath
  });


  newShow.save((err, show) => {
    if(err) {
      res.json({success: false, msg: "Failed to create show"})
      console.log(err)
    } else {
      res.json({success: true, msg: "Show created successfully"})
    }
  });
});

router.put('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  var timeSlots = req.body.timeSlots
  var Djs = req.body.djs
  var Days = req.body.days


  let newShow = new Show({
    name: req.body.name,
    timeslots: timeSlots,
    djs: Djs,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    days: Days,
    timeString: req.body.timeString,
    type: req.body.type,
    duration: req.body.duration,
    tags: req.body.tags,
    thumbnailPath: req.body.thumbnailPath,
    bannerPath: req.body.bannerPath
  });

  Show.findByIdAndUpdate({_id: req.params.id}, {$set: {
    'name': req.body.name,
    'timeslots': timeSlots,
    'djs': Djs,
    'description': req.body.description,
    'startDate': req.body.startDate,
    'endDate': req.body.endDate,
    'days': Days,
    'timeString': req.body.timeString,
    'type': req.body.type,
    'duration': req.body.duration,
    'tags': req.body.tags,
    'thumbnailPath': req.body.thumbnailPath,
    'bannerPath': req.body.bannerPath
  }})
    .then((show, err) => {
      if(err) {
        console.log(err);
        res.json({success:false, msg: 'failed to edit show'})
      } else {
        res.json({success: true, msg: 'Show successfully edited'})
      }
    })
});


//multer disk storage for images
var storage = multer.diskStorage({
  // destination folder
  destination: function (req, file, cb) {
    cb(null, './public/show-banner/')
  },
  //  rename file to originalname
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now());
  }
});

//returns list of all shows
router.get('/showlist', (req, res, next) => {
  Show.find({})
    .then((shows) => {
      res.send(shows);
    })
    .catch(next);
});

//change the on air status of a show
router.put('/change-status', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Show.findByIdAndUpdate({_id: req.body.id}, {$set: {onAir: req.body.status}})
    .then((show, err) => {
      if(err) {
        res.json({success: false, msg: 'Something went wrong'});
        return false
      } else {
        res.json({success: true, msg: 'Status updated!'});
        return true
      }
    })
})

//memory storage to allow processing of image
var thumbnailStorage = multer.memoryStorage();

var upload = multer({storage: storage});

var thumbnailUpload = multer({storage: thumbnailStorage});

//post show banner image
router.post('/images/show-banner', upload.single('file'), passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({path: req.file.path});
})

//post show thumbnail
router.post('/images/thumbnail', thumbnailUpload.single('file'), passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Jimp.read(req.file.buffer, (err, image) => {
    image.resize(100, 100);
    image.write('./public/show-thumbnails/' + req.file.originalname)
  });

  if(req.body.showId){
    let id = req.body.showId;
    Show.findOneAndUpdate({_id: id}, {$set: {"thumbnailPath": 'public/show-thumbnails/' + req.file.originalname}})
      .then( (article, err ) => {
        if (err) {
          res.json({success: false, msg: 'failed to upload image'})
        } else {
          res.json({success: true, msg: 'Image Uploaded!', path: 'public/show-thumbnails/' + req.file.originalname})
        }
      });
  } else {
    res.json({path: 'public/show-thumbnails/' + req.file.originalname})
  }

});

//delete show
router.delete('/delete/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Show.findByIdAndRemove({_id:req.params.id})
    .then(function(show){
      res.send(show);
    });
});

//get show by id
router.get('/get/:id', (req, res, next) => {
  Show.findOne({_id: req.params.id})
    .then(show => {
      res.send(show)
    })
})


module.exports = router;
