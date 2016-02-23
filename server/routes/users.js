var express = require('express');
var passport = require('passport');
var Users = require('../models/users.js');
var router = express.Router();

//handler for calls to api/users
router.get('/', function(req, res) {
  
});

router.put('/', function(req, res) {
  
});

router.delete('/', function(req, res) {
  
});

router.post('/register', function(req, res) {

  console.log("registering user");
  console.log("user is", req.body.email);

  if (req.body.password !== req.body.passwordConfirm) {
    console.log('error, passwords do not match');
    res.send({message: 'Passwords do not match'});
    return;
  }

  Users.register(new Users({
    email: req.body.email,
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
        message :'Error while registering user'
      });
    } else {
      passport.authenticate('local')(req, res, function(){
        console.log('user registered!');
        //not confident in this route
        res.redirect('#/addBooking');
      });
    }
  })
});

router.post('/login', passport.authenticate('local'), function(req, res){
  //eventually, we'll want this to redirect to a user profile page
    console.log('Sucesfully logged in');
    res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  console.log('Sucesfully logged out');
  res.redirect('/');
});

module.exports = router;