// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router;
const cors = require('cors');
const passport = require('passport');
const cron = require('cron');




// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/cjlo-docker';

// Connect to mongodb
mongoose.connect(dbHost);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+ dbHost);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});


// Get our API routes
const api = require('./routes/api');
const users = require('./routes/users');
const articles = require('./routes/articles');
const shows = require('./routes/shows');

const app = express();

//passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// CORS Middleware
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set our api routes
app.use('/', api);
app.use('/users', users);
app.use('/articles', articles);
app.use('/shows', shows);


require('./config/passport')(passport);

const articleModel = require('./models/article');

var cronJob = cron.job(" 00 00 */1 * * *", function(){
    let cut = Date.now();
    let query1 = {status: 'published', unpublish_on: {$lt: cut}}

    articleModel.update(
      query1,
      { $set: {status: 'unpublished'}},
      {multi: true},
      (err, num) => {
        if(err){
          console.log(err);
        }
      }
    );

    let query2 = {publish_on: {$lt: cut}, $or: [{unpublish_on: {$gt: cut}}, {unpublish_on: null}]};

    articleModel.update(
      query2,
      { $set: {status: 'published'}},
      {multi: true},
      (err, num) => {
        if(err){
          console.log(err);
        }
      }
    );

    console.log('article cleanup completed');
});
cronJob.start();

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
