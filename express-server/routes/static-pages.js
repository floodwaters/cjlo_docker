const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const multer = require('multer');
const StaticPage = require('../models/static-page');

//create a static page
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let newPage = new StaticPage({
    title: req.body.title,
    body: req.body.articleBody
  });

  newPage.save((err, article) => {
    if(err){
      res.json({success: false, msg: 'Failed to save article'})
      console.log(err)
    } else {
      res.json({success: true, msg: 'Article saved!', articleId: article._id})
    }
  });
});

//edit static pages
router.put('/edit/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  StaticPage.findOneAndUpdate({_id: req.params.id},
    {$set: {"title": req.body.title, "body": req.body.body}})
    .then( (article, err) => {
      if(err){
        res.json({success: false, msg: 'Could not edit article'})
      } else {
        res.json({success: true, msg: 'Article successfully edited'})
      }
    });
});

//get static page based on id
router.get('/get/:id', (req, res, next) => {
  StaticPage.findOne({_id: req.params.id})
    .then((article) => {
        res.send(article);
    });
});

//changes the published status of a static page
router.put('/published/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  StaticPage.findOneAndUpdate({_id: req.params.id},
    {$set: {"published": req.body.published}})
    .then( (article, err) => {
      if(err){
        res.json({success: false, msg: 'Could not change status of page'})
      } else {
        res.json({success: true, msg: 'Page status successfully changed'})
      }
    });
});

//delete static page
router.delete('/delete/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  StaticPage.findByIdAndRemove({_id:req.params.id})
    .then(function(article){
      res.send(article);
    });
});

//get all static pages
router.get('/get-pages', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  StaticPage.find({})
    .then((pages) => {
      res.send(pages);
    });
});

//get published static pages
router.get('/get-published', (req, res, next) => {
  StaticPage.find({published: true})
    .sort({'title': 1})
    .limit(12)
    .exec((err, pages) => {
      if (err){
        console.log(err);
      } else {
        res.send(pages);
      }
    });
});

//multer disk storage for images
var storage = multer.diskStorage({
  // destination folder
  destination: function (req, file, cb) {
    cb(null, './public/static-page-images')
  },
  //  rename file to originalname
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now());
  }
});

var upload = multer({storage: storage});

//post images for static pages
router.post('/images', upload.single('file'), passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({link: 'http://localhost:3000/' + req.file.path});
});

module.exports = router;
