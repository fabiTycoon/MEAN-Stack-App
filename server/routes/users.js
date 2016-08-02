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

router.get('users', function (req, res){
  User.find({}, function (err, returnedUsers){
    res.json(returnedUsers);
  });
});

router.get('/:email', function(req, res) {
    console.log("USER ID:", req)
    console.log("REQBODY:", req.body)
    console.log("REQUSEr:", req.user)

      if (req.params.email) {
        User.find({email: req.params.email}, function (err, returnedUser) {
        return res.json(returnedUser);
        });
      };
});


router.post('/register', function(req, res) {
  
  console.log("registering user", req.body);

  if (req.body.password !== req.body.passwordConfirm) {
    console.log('error, passwords do not match');
    res.status(501).json({'message': 'Passwords do not match'});
    return;
  };

  var password = req.body.password;

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
  }), password, function (err, user){

    if (err) {
      return res.send({
        'success': false,
        'error': err
      })
    } else {

      passport.authenticate('local')(req, res, function () {
        return res.send({
          'success': true,
          'user': user
        });
      });
    };
  });
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