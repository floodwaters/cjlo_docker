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
    body: req.body.articleBody,
    created_at: Date.now(),
    published: req.body.published,
    publish_on: req.body.publish_on,
    unpublish_on: req.body.unpublish_on,
    highlighted: req.body.highlighted
  });

  newArticle.save((err, article) => {
    if(err){
      res.json({success: false, msg: 'Failed to save article'})
    } else {
      res.json({success: true, msg: 'Article saved!'})
    }
  });
});

//delete an article
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Article.findByIdAndRemove({_id:req.params.id})
    .then(article) => {
      res.send(article);
    });
})
