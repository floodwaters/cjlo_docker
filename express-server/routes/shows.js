const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Article = require('../models/article');
const Episode = require('../models/episode');
const Show = require('../models/show');
const multer = require('multer');
const Jimp = require('jimp');
const Promise = require('bluebird');
const fileType = require('file-type');

//create show
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  var Djs = req.body.djs

  let newShow = new Show({
    name: req.body.name,
    djs: Djs,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    startDays: req.body.startDays,
    startHour: req.body.startHour,
    startMinute: req.body.startMinute,
    endDays: req.body.endDays,
    endHour: req.body.endHour,
    endMinute: req.body.endMinute,
    genre: req.body.genre,
    timeString: req.body.timeString,
    type: req.body.type,
    duration: req.body.duration,
    tags: req.body.tags,
    thumbnailPath: req.body.thumbnailPath,
    bannerPath: req.body.bannerPath,
    placeholder: req.body.placeholder
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

//edit a show in the database
router.put('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  var Djs = req.body.djs;
  var tags = req.body.tags;


  Show.findByIdAndUpdate({_id: req.params.id}, {$set: {
    'name': req.body.name,
    'djs': Djs,
    'description': req.body.description,
    'startDate': req.body.startDate,
    'endDate': req.body.endDate,
    'timeString': req.body.timeString,
    'type': req.body.type,
    'duration': req.body.duration,
    'tags': tags,
    'thumbnailPath': req.body.thumbnailPath,
    'bannerPath': req.body.bannerPath,
    'placeholder': req.body.placeholder,
    'startDays': req.body.startDays,
    'startHour': req.body.startHour,
    'startMintue': req.body.startMinute,
    'genre': req.body.genre
  }})
    .then((show, err) => {
      if(err) {
        console.log(err);
        res.json({success:false, msg: 'failed to edit show'})
      } else {
        console.log(req.body.genre)

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

//returns the episodes for a show
router.get('/episodes/:id', (req, res, next) => {
  Episode.find({show: req.params.id, endDate: {$lt: Date.now()}})
    .then((episodes, err) => {
      if(err){
        console.log(err)
        res.json({success: false, msg: 'Something went wrong'})
      } else if (episodes === null){
        res.json({success: false, msg: 'There were no episodes'})
      } else {
        res.send(episodes)
      }
    })
})

//returns all shows that are listed as on air
router.get('/get-on-air', (req, res, next) => {
  Show.find({onAir: true})
    .then(shows => {
      res.send(shows)
    });
});

//returns all shows that are listed as archived
router.get('/get-archive', (req, res, next) => {
  Show.find({archive: true})
    .then(shows => {
      res.send(shows)
    });
});

//change the archive status of a show
router.put('/change-archive', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Show.findByIdAndUpdate({_id: req.body.id}, {$set: {archive: req.body.status}})
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

var bannerStorage = multer.memoryStorage();

var upload = multer({storage: bannerStorage});

var thumbnailUpload = multer({storage: thumbnailStorage});

//post show banner image
router.post('/images/show-banner', upload.single('file'), passport.authenticate('jwt', {session: false}), (req, res, next) => {
  var rand = Math.floor(Math.random() * 200000).toString()
  Jimp.read(req.file.buffer, (err, image) => {
    image.resize(300, 300);
    image.write('./public/show-banners/' + rand + req.file.originalname);
  });


  if(req.body.showId){
    let id = req.body.showId;
    Show.findOneAndUpdate({_id: id}, {$set: {"bannerPath": 'public/show-banners/' + rand + req.file.originalname}})
      .then((article, err) => {
        if (err) {
          res.json({success: false, msg: 'failed to upload image'})
        } else {
          res.json({success: true, msg: 'Image uploaded!', path: 'public/show-banners/' + rand + req.file.originalname})
        }
      })
  } else {
    res.json({path: 'public/show-banners/' + rand + req.file.originalname})
  }
})

//post show thumbnail
router.post('/images/thumbnail', thumbnailUpload.single('file'), passport.authenticate('jwt', {session:false}), (req, res, next) => {
  var rand = Math.floor(Math.random() * 200000).toString()
  Jimp.read(req.file.buffer, (err, image) => {
    image.resize(100, 100);
    image.write('./public/show-thumbnails/' + rand + req.file.originalname)
  });
  if(req.body.showId){
    let id = req.body.showId;
    Show.findOneAndUpdate({_id: id}, {$set: {"thumbnailPath": 'public/show-thumbnails/' + rand + req.file.originalname}})
      .then( (article, err ) => {
        if (err) {
          res.json({success: false, msg: 'failed to upload image'})
        } else {
          res.json({success: true, msg: 'Image Uploaded!', path: 'public/show-thumbnails/' + rand + req.file.originalname})
        }
      });
  } else {
    res.json({path: 'public/show-thumbnails/' + rand + req.file.originalname})
  }

});

//delete show
router.delete('/delete/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Show.findByIdAndRemove({_id:req.params.id})
    .then((show) => {
      res.send(show);
    });
});

//get show by id
router.get('/get/:id', (req, res, next) => {
  Show.findOne({_id: req.params.id})
    .then(show => {
      res.send(show)
    });
});

router.get('/get-by-user/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Show.find({djs: req.params.id})
    .then(shows => {
      res.send(shows)
    });
});

//find shows that occur on a given day and are on the air
router.post('/get-by-day', (req, res, next) => {
  Show.find({days: req.body.day, onAir: true})
    .then(shows => {
      res.send(shows)
    });
});

//get placeholder show
router.get('/get-placeholder', (req, res, next) => {
  Show.findOne({placeholder: true})
    .then(show => {
      res.send(show)
    });
});

//get active and archived shows
router.get('/get-for-playlist', (req, res, next) => {
  Show.find({ $or: [{onAir: true}, {archive: true}]}, (err, shows) => {
    if(err){
      console.log(err);
      res.json({success: false, msg: "Could not retrieve shows"})
    } else {
      res.send(shows);
    }
  });
});

//get unique tags from the database
router.get('/get-tags', (req, res, next) => {
  Show.find().distinct('tags', (err, tags) => {
    if(err){
      console.log(err);
      res.json({success: false, msg: 'Could not retrieve tags'});
    } else {
      res.send(tags);
    }
  })
})


module.exports = router;
