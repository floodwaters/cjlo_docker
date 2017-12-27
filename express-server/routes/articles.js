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
const fs = require('fs-extra');




//create an article
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let newArticle = new Article({
    title: req.body.title,
    author: req.user._id,
    articleBody: req.body.articleBody,
    articleBody2: req.body.articleBody2,
    articleBody3: req.body.articleBody3,
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
    {$set: {"title": req.body.title, "articleBody2": req.body.articleBody2, "articleBody3": req.body.articleBody3, "articleBody": req.body.articleBody, "preview": req.body.preview, "publish_on": req.body.publish_on, "unpublish_on": req.body.unpublish_on}})
    .then( (article, err) => {
      if(err){
        res.json({success: false, msg: 'Could not edit article'})
      } else {
        res.json({success: true, msg: 'Article successfully edited'})
      }
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
router.put('/highlight/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Article.findOneAndUpdate({_id: req.params.id}, {$set: {"highlighted": req.body.highlighted}})
    .then((article, err) => {
      if(err){
        res.json({success: false, msg: 'could not change status'});
      } else {
        res.json({success: true, msg: 'Status successfully changed!'})
      }
    });
})

//change spotlight status
router.put('/spotlight/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Article.findOneAndUpdate({_id: req.params.id}, {$set: {"spotlight": req.body.spotlight}})
    .then((article, err) => {
      if(err){
        res.json({success: false, msg: 'could not change status'});
      } else {
        res.json({success: true, msg: 'Status successfully changed!'})
      }
    });
})

//change magazine staatus
router.put('/magazine/:id', (req, res, next) => {
  Article.findOneAndUpdate({_id: req.params.id}, {$set: {"magazine": req.body.magazine}})
    .then((article, err) => {
      if(err){
        res.json({success: false, msg: 'could not change status'});
      } else {
        res.json({success: true, msg: 'Status successfully changed!'})
      }
    });
})

//change news and events staatus
router.put('/news-and-events/:id', (req, res, next) => {

  Article.findOneAndUpdate({_id: req.params.id}, {$set: {"newsAndEvents": req.body.newsAndEvents}})
    .then((article, err) => {
      if(err){
        res.json({success: false, msg: 'could not change status'});
      } else {
        res.json({success: true, msg: 'Status successfully changed!'})
      }
    });
})

//change video staatus
router.put('/video/:id', (req, res, next) => {
  Article.findOneAndUpdate({_id: req.params.id}, {$set: {"video": req.body.video}})
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

//get the spotlight article
router.get('/get-spotlight', (req, res, next) => {
  Article.find({$and: [{status: 'published'}, {spotlight: true}]})
    .exec((err, article) => {
      if(err) {
        console.log(err)
      } else {
        res.send(article)
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

//multer disk storage for images
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

//memory storage to allow processing of image
var thumbnailStorage = multer.memoryStorage();

var imageStorage = multer.memoryStorage();

var upload = multer({storage: storage});

var thumbnailUpload = multer({storage: thumbnailStorage});

var imageUpload = multer({storage: imageStorage});

//post images for articles
router.post('/images', upload.single('file'), passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({link: 'http://localhost:3000/' + req.file.path});
});

//post image 1
router.post('/image1', imageUpload.single('file'), passport.authenticate('jwt', {session: false}), (req, res, next) => {
  var rand = Math.floor(Math.random() * 200000).toString()

  Jimp.read(req.file.buffer, (err, image) => {
    image.resize(300, 300);
    image.write('./public/article-images/' + rand + req.file.originalname);
  });

  let id = req.body.articleId;
  Article.findOneAndUpdate({_id: id}, {$set: {"image1Path": 'public/article-images/' + rand + req.file.originalname}})
    .then((article, err) => {
      if (err) {
        res.json({success: false, msg: 'failed to upload image'})
      } else {
        console.log(req.body.articleId)
        res.json({success: true, msg: 'Image Uploaded!', path: 'public/article-images/' + rand + req.file.originalname})
      }
    });
});

//post image 2
router.post('/image2', imageUpload.single('file'), passport.authenticate('jwt', {session: false}), (req, res, next) => {
  var rand = Math.floor(Math.random() * 200000).toString()

  Jimp.read(req.file.buffer, (err, image) => {
    image.resize(300, 300);
    image.write('./public/article-images/' + rand + req.file.originalname);
  });

  let id = req.body.articleId;
  Article.findOneAndUpdate({_id: id}, {$set: {"image2Path": 'public/article-images/' + rand + req.file.originalname}})
    .then((article, err) => {
      if (err) {
        res.json({success: false, msg: 'failed to upload image'})
      } else {
        res.json({success: true, msg: 'Image Uploaded!', path: 'public/article-images/' + rand + req.file.originalname})
      }
    });
});

//post image 3
router.post('/image3', imageUpload.single('file'), passport.authenticate('jwt', {session: false}), (req, res, next) => {
  var rand = Math.floor(Math.random() * 200000).toString()

  Jimp.read(req.file.buffer, (err, image) => {
    image.resize(300, 300);
    image.write('./public/article-images/' + rand + req.file.originalname);
  });

  let id = req.body.articleId;
  Article.findOneAndUpdate({_id: id}, {$set: {"image3Path": 'public/article-images/' + rand + req.file.originalname}})
    .then((article, err) => {
      if (err) {
        res.json({success: false, msg: 'failed to upload image'})
      } else {
        res.json({success: true, msg: 'Image Uploaded!', path: 'public/article-images/' + rand + req.file.originalname})
      }
    });
});

//delete image 1
router.post('/delete-image1', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Article.findOneAndUpdate({_id: req.body.articleId}, {$set: {"image1Path": null}})
    .then((article, err) => {
      if (err){
        res.json({success: false, msg: 'Failed to delete Image'})
      } else {
        fs.unlink(req.body.path)
        res.json({success: true, msg: 'Image has been deleted'})
      }
    });
});

//delete image 2
router.post('/delete-image2', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Article.findOneAndUpdate({_id: req.body.articleId}, {$set: {"image2Path": null}})
    .then((article, err) => {
      if (err){
        res.json({success: false, msg: 'Failed to delete Image'})
      } else {
        fs.unlink(req.body.path)
        res.json({success: true, msg: 'Image has been deleted'})
      }
    });
});

//delete image 3
router.post('/delete-image3', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Article.findOneAndUpdate({_id: req.body.articleId}, {$set: {"image3Path": null}})
    .then((article, err) => {
      if (err){
        res.json({success: false, msg: 'Failed to delete Image'})
      } else {
        fs.unlink(req.body.path)
        res.json({success: true, msg: 'Image has been deleted'})
      }
    });
});

//post article thumbnail
router.post('/thumbnail', thumbnailUpload.single('file'), passport.authenticate('jwt', {session:false}), (req, res, next) => {
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

//get highlighted articles for magazine
router.get('/get-magazine', (req, res, next) => {
  Article.find({highlighted: true, status: 'published', magazine: true})
    .sort({created_on: -1})
    .limit(5)
    .then((articles) => {
      res.send(articles);
    })
    .catch(err => {
      console.log(err);
    });
});

//get highlighted articles for news and events
router.get('/get-news-and-events', (req, res, next) => {
  Article.find({highlighted: true, status: 'published', newsAndEvents: true})
    .sort({created_on: -1})
    .limit(5)
    .then((articles) => {
      res.send(articles);
    })
    .catch(err => {
      console.log(err);
    });
});

//get highlighted articles for video
router.get('/get-video', (req, res, next) => {
  Article.find({highlighted: true, status: 'published', video: true})
    .sort({created_on: -1})
    .limit(5)
    .then((articles) => {
      res.send(articles);
    })
    .catch(err => {
      console.log(err);
    });
});

//get highlighted articles for session
router.get('/get-session', (req, res, next) => {
  Article.find({highlighted: true, status: 'published', session: true})
    .sort({created_on: -1})
    .limit(5)
    .then((articles) => {
      res.send(articles);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
