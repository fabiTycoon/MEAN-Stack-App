var express = require('express');
var bodyParser = require('body-parser');
var Path = require('path');
var passport = require('passport');

var db = require('./lib/db');
var Users = require('./models/users');
//var pg = require('pg');

var port = process.env.PORT || 8080; 
var assetFolder = Path.resolve(__dirname, '../app/');

var app = express();
var router = express.Router();

router.use(express.static(assetFolder));

// parse application/json 
app.use(bodyParser.json());

// Mount our main router
app.use('/', router);

//Start the server
app.listen(port, function() {
    console.log('Listening on port %d in mode %s', port, app.get('env'));
  });

// SERVE APPLICATION FILES:

//Define API endpoints for users, pets, and reservations:

//User:
router.get('/user', function (req, res) {
  //call database with db.functionName();


});

// Creates new user
router.post('/api/signup', function (req, res, next) {
  passport.authenticate('local-signup', function (err, user, info) {
    if (err) {
      res.status(500).json({ signedUp: false, error: err, info: info });
      return;
    }
    if (!user) {
      res.status(401).json({ signedUp: false, info: info });
      return;
    }
    res.status(201).json({ signedUp: true });
  })(req, res, next);
});

router.put('/user', function (req, res) {
  //update user info
  res.send();
})

router.delete('/user', function (req, res) {
  //delete a user
  res.send();
})

// Default endpoint:
app.get('/*', function (req, res) {
  res.sendFile(assetFolder + '/index.html');
});


