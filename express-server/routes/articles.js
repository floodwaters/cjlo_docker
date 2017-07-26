const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Article = require('../models/article');
const multer = require('multer');
const Jimp = require('jimp');
const Promise = require('bluebird');
const fileType = require('file-type');



//create an article
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let newArticle = new Article({
    title: req.body.title,
    author: req.user._id,
    articleBody: req.body.articleBody,
    preview: req.body.preview,
    created_at: Date.now(),
    status: 'draft'
  });

  newArticle.save((err, article) => {
    if(err){
      res.json({success: false, msg: 'Failed to save article'})
      console.log(err)
    } else {
      res.json({success: true, msg: 'Article saved!', articleId: article._id})
    }
  });
});

//edit articles
router.put('/edit/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Article.findOneAndUpdate({_id: req.params.id},
    {$set: {"title": req.body.title, "articleBody": req.body.articleBody, "preview": req.body.preview, "publish_on": req.body.publish_on, "unpublish_on": req.body.unpublish_on}})
    .then( (article) => {
      res.send(article)
    });
});

//change article status
router.put('/edit/status/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Article.findOneAndUpdate({_id: req.params.id}, {$set: {"status": req.body.status}})
    .then( (article, err) => {
      if(err){
        res.json({success: false, msg: 'could not update status'});
      } else {
        res.json({success: true, msg: 'Status successfully updated!'});
      }
    });
});

//change highlight staatus
router.put('/highlight/:id', (req, res, next) => {
  console.log('hi')
  Article.findOneAndUpdate({_id: req.params.id}, {$set: {"highlighted": req.body.highlighted}})
    .then((article, err) => {
      if(err){
        res.json({success: false, msg: 'could not change status'});
      } else {
        res.json({success: true, msg: 'Status successfully changed!'})
      }
    });
})

//get article drafts based on user id
router.get('/get-drafts/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  let query = {status: 'draft', author: req.params.id}
  Article.find(query)
    .then( (articles) => {
      res.send(articles);
    });
});

//get article based on id
router.get('/get/:id', (req, res, next) => {
  Article.findOne({_id: req.params.id})
    .then((article) => {
        res.send(article)
    });
});

//get articles under review
router.get('/get-review', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  let query = {status: 'review'}
  Article.find(query)
    .populate('author')
    .exec((err, articles) => {
      if (err) {
        console.log(err)
      }
      res.send(articles);
    });
});



//get published articles
router.get('/get-published', (req, res, next) => {
  let query = {status: 'published'}
  Article.find(query)
    .populate('author')
    .exec((err, articles) => {
      if (err) {
        console.log(err)
      }
      res.send(articles);
    });
});

//get unpublished articles
router.get('/get-unpublished', (req, res, next) => {
  let query = {status: 'unpublished'}
  Article.find(query)
    .populate('author')
    .exec((err, articles) => {
      if (err) {
        console.log(err)
      }
      res.send(articles);
    });
});

//delete articles
router.delete('/delete/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Article.findByIdAndRemove({_id:req.params.id})
    .then(function(article){
      res.send(article);
    });
});

var storage = multer.diskStorage({
  // destination folder
  destination: function (req, file, cb) {
    cb(null, './public/')
  },
  //  rename file to originalname
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now());
  }
});

var thumbnailStorage = multer.memoryStorage();




var upload = multer({storage: storage});

var thumbnailUpload = multer({storage: thumbnailStorage});

//post images for articles
router.post('/images', upload.single('file'), passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({link: 'http://localhost:3000/' + req.file.path});
});

//post article thumbnail
router.post('/images/thumbnail', thumbnailUpload.single('file'), passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Jimp.read(req.file.buffer, (err, image) => {
    image.resize(150, 150);
    image.write('./public/thumbnails/' + req.file.originalname)
  });
  let id = req.body.articleId;
  Article.findOneAndUpdate({_id: id}, {$set: {"thumbnailPath": 'public/thumbnails/' + req.file.originalname}})
    .then( (article, err ) => {
      if (err) {
        res.json({success: false, msg: 'failed to upload image'})
      } else {
        res.json({success: true, msg: 'Image Uploaded!', path: 'public/thumbnails/' + req.file.originalname})
      }
    });

});

module.exports = router;
