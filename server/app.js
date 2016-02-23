//NPM MODULES:
var express = require('express');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var uuid = require('node-uuid');
var path = require('path');
var passport = require('passport');
var config = require('./lib/passport.js');

//LOCAL MODULES:
var db = require('./lib/db');
var Users = require('./models/users');

//PATHS:
var port = process.env.PORT || 8080; 
var assetFolder = path.resolve(__dirname, '../app/');

//APPLICATION LOGIC:
var app = express();
var router = express.Router();
//make sure to serve static files before session middleware:
app.use(express.static(assetFolder));

// parse application/json 
app.use(bodyParser.urlencoded({ extended: true }) );
app.use(bodyParser.json());
//log requests to the console
app.use(morgan('dev'));
// Parse incoming cookies
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'many cats on a keyboard',
    resave: false,
    saveUninitialized: false
}));


// Mount our main router
app.use('/', router);

//set up passport for persistent sessions
app.use(passport.session({ secret: 'In tigers and tabbies, the middle of the tongue is covered in backward-pointing spines, used for breaking off and gripping meat.' }));
app.use(passport.initialize());
app.use(passport.session());

//Start the server
app.listen(port, function() {
    console.log('Listening on port %d in mode %s', port, app.get('env'));
  });


//USER ENDPOINTS - TODO REFACTOR IN SEPERATE MODULE:
router.get('/user', function (req, res) {

  /*var userEmail = req.body.email;
  console.log("user's email is:", userEmail);
  Users.findByEmail(userEmail)
    .then(function(user){
      if (!user) {
        done(null, false, { message: 'Unable to locate an account with that e-mail address'});
        return;
      } else {
        res.sendFile(user);
      };
    });*/

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
      console.log("cannot find user", res, res.body);
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


