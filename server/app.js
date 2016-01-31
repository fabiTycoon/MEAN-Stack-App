//NPM MODULES:
var config = require('./lib/passport.js');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var Path = require('path');
var passport = require('passport');

//LOCAL MODULES:
var db = require('./lib/db');
var Users = require('./models/users');

//PATHS:
var port = process.env.PORT || 8080; 
var assetFolder = Path.resolve(__dirname, '../app/');

//APPLICATION LOGIC:
var app = express();
var router = express.Router();

router.use(express.static(assetFolder));

// parse application/json 
app.use(bodyParser.json());
//log requests to the console
app.use(morgan('dev'));
// Mount our main router
app.use('/', router);

//set up passport for persistent sessions
app.use(passport.initialize());
app.use(passport.session());

//Start the server
app.listen(port, function() {
    console.log('Listening on port %d in mode %s', port, app.get('env'));
  });


//USER ENDPOINTS - TODO REFACTOR IN SEPERATE MODULE:
router.get('/user', function (req, res) {

});

// Creates new user
router.post('/api/signup', function (req, res, next) {
  console.log("reached signup endpoint, req object is", req.body);

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

//PET ENDPOINTS:

//RESERVATION ENDPOINTS:

//TERMINAL ENDPOINT:
app.get('/*', function (req, res) {
  res.sendFile(assetFolder + '/index.html');
});


