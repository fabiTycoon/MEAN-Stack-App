var express = require('express');
var passport = require('passport');
var Users = require('../models/users.js');
var router = express.Router();
var password = ('../lib/password.js');

//handler for calls to api/users
router.get('/', function(req, res) {
  
});

router.post('/register', function(req, res) {
  console.log("registering user");
  var tempPass = password.newPassword(10);
  console.log("user is", req.body.email);
  console.log("tempPass is", tempPass);

  Users.register(new User({username: req.body.email}), tempPass, function (err){

    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');
    //not confident in this route
    res.redirect('../addBooking.html');

  })
});

router.put('/', function(req, res) {
  
});

router.delete('/', function(req, res) {
  
});

module.exports = router;