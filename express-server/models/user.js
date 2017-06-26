const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//user schema
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  roles: {
        type: [{
            type: String,
            enum: ['user', 'admin', 'dj', 'author', 'editor', 'show admin']
        }],
        default: ['user']
      }
});

const User = module.exports = mongoose.model('User', UserSchema);

//enables searching for users by ID
module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

//enables searching for users by Username
module.exports.getUserByUsername = (username, callback) => {
  const query = {username: username};
  User.findOne(query, callback);
};



//adds a new user to the database
module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

//compares hashed password with user submitted password

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
