const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');




// Register
router.post('/register', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    roles: JSON.parse(req.body.roles)
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

//update user info
router.put('/update-roles/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {

  User.findByIdAndUpdate({_id: req.params.id}, { $set: { roles: req.body }})
  .then(function(){
    User.findOne({_id: req.params.id})
    .then(function(user){
      res.send(user);
    });
  });
  res.json({user: req.user});
});

//find user roles by id
router.get('/get-roles/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  User.findOne({_id: req.params.id})
    .then((user) => {
      res.send(user.roles);
    });
});

//find users by role
router.post('/find-by-role', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  User.find({roles: req.body.role})
    .then((users) => {
      res.json(users)
    })
})

// User list
router.get('/userlist', (req, res, next) => {
  User.find({}).then((user) => {
    res.send(user);

  }).catch(next);
});

//delete users
router.delete('/delete/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  User.findByIdAndRemove({_id:req.params.id})
    .then(function(user){
      res.send(user);
    });
});




module.exports = router;
