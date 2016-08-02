var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/users.js');
var passportLocalMongoose = require('passport-local-mongoose');

//handlers for calls to api/users
/*router.get('/users/', function(req, res) {
  
});

router.put('/', function(req, res) {
  
});

router.delete('/', function(req, res) {
  
});*/

router.get('/userId/', function(req, res) {
    console.log("USER ID:", req)
    console.log("REQBODY:", req.body)
    console.log("REQUSEr:", req.user)
  var userId = req.user;
  return res.status(200).json({'data': userId});
});

router.post('/register', function(req, res) {

  
  console.log("registering user", req.body);
  console.log("user is", req.body.username);
  console.log("phone is", req.body.phone);
  console.log("password is", req.body.password);
/*
  if (req.body.password !== req.body.passwordConfirm) {
    console.log('error, passwords do not match');
    res.status(501).json({'message': 'Passwords do not match'});
    return;
  };*/

  //Passport local mongoose takes care of hashing etc;
  User.register(new User({
    username: req.body.username,
    first: req.body.first,
    last: req.body.last,
    email: req.body.email,
    phone: req.body.phone,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    hospital: req.body.hospital
  }), req.body.password, function (err, account){

    if (err) {
      console.log('Registration error mongoose:', err);
      console.log('Registration error mongoose:', JSON.stringify(err));
    }; 
      
    passport.authenticate('local')(req, res, function(){
      console.log('user registered!');
      req.login(req.body.username);
      console.log('user logged in omg')
      res.status(200).json({'logged in response': res});
    });
  })
});

router.post('/login', passport.authenticate('local'), function(req, res, info){

  var user = req.body.username
  var password = req.body.password

 /* if (!user) {
    return res.status(401).json({
      'err': 'Cannot find an account for that e-mail address',
      'loggedIn': false
    });
  };*/
  console.log("LOGIN: ", res);
    console.log("LOGIN: ", info);

  return res.status(200).json({'info': info, 'loggedIn': true});
});

router.get('/logout', function(req, res){
  req.logout();
  console.log('Sucesfully logged out');
  res.redirect('/');
});

module.exports = router;