var express = require('express');
var passport = require('passport');
var User = require('../models/users.js');
var router = express.Router();
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

//handlers for calls to api/users
/*router.get('/users/', function(req, res) {
  
});

router.put('/', function(req, res) {
  
});

router.delete('/', function(req, res) {
  
});*/

router.get('/users/', function(req, res) {
  var userId = req.body.user_id //not sure about this
});

router.post('/register', function(req, res) {

  var username = req.body.username
  console.log("registering user");
  console.log("user is", username);

  if (req.body.password !== req.body.passwordConfirm) {
    console.log('error, passwords do not match');
    res.send({message: 'Passwords do not match'});
    return;
  }

  //Passport local mongoose takes care of hashing etc;
  User.register(new User({
    email: username,
    password: req.body.password,
    first: req.body.first,
    last: req.body.last,
    phone: req.body.phone,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    hospital: req.body.hospital,
    admin: false
  }), req.body.password, function (err){

    if (err) {
      console.log('Registration error!', err);
      res.send({
        message: err
      });
    } else {
      passport.authenticate('local')(req, res, function(){
        console.log('user registered!');
        req.login(username);
        console.log('user logged in omg')
        res.redirect('#/addBooking');
      });
    }
  })
});

router.post('/login', passport.authenticate('local'), function(req, res, info){
  //user should be a call to DB fn findByEmail 

  var user = req.body.username
  var password = req.body.password

  if (!user) {
    return res.status(401).json({
      err: 'Cannot find an account for that e-mail address',
      loggedIn: false
    });
  };
  
  return res.status(200).json({info: info, loggedIn: true});
});

router.post('/logout', function(req, res){
  var user = req.body.username  //we should be able to grab the user object from any req - use this instead
  req.logout(user);
  console.log('Sucesfully logged out');
  res.redirect('/');
});

module.exports = router;