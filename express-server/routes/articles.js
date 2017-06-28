const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Article = require('../models/article');


//create an article
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let newArticle = new Article({
    title: req.body.title,
    author: req.user._id,
    articleBody: req.body.articleBody,
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
  Article.findOneAndUpdate({_id: req.params.id}, {$set: {"title": req.body.title, "articleBody": req.body.articleBody}})
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

//delete articles
router.delete('/delete/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Article.findByIdAndRemove({_id:req.params.id})
    .then(function(article){
      res.send(article);
    });
});

module.exports = router;
