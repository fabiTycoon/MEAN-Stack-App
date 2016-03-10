var express = require('express');
var passport = require('passport');
var Users = require('../models/users.js');
var router = express.Router();

//handlers for calls to api/users
/*router.get('/', function(req, res) {
  
});

router.put('/', function(req, res) {
  
});

router.delete('/', function(req, res) {
  
});*/

router.post('/register', function(req, res) {

  console.log("registering user");
  console.log("user is", req.body.email);

  if (req.body.password !== req.body.passwordConfirm) {
    console.log('error, passwords do not match');
    res.send({message: 'Passwords do not match'});
    return;
  }

  //Passport local mongoose takes care of hashing etc;
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
        message: err
      });
    } else {
      passport.authenticate('local')(req, res, function(){
        console.log('user registered!');
        res.redirect('#/addBooking');
      });
    }
  })
});

router.post('/login', passport.authenticate('local'), function(req, res){
  console.log("logging in...")

  var user = req.body.email
  var password = req.body.password
  
  //user should be a call to DB fn findByEmail 
  if (!user) {
    return res.status(401).json({
      err: 'Cannot find an account for that e-mail address'
    });
  }


  console.log('Sucesfully logged in, user is:', user);
  //eventually, we'll want this to redirect to a user profile page
  res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  console.log('Sucesfully logged out');
  res.redirect('/');
});

module.exports = router;