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

  if (req.user && req.user.admin === true ) {
    User.find({}, function (err, returnedUsers){
      res.json(returnedUsers);
    });    
  };
});

router.get('/:email', function(req, res) {
    console.log("USER ID:", req)
    console.log("REQBODY:", req.body)
    console.log("REQUSEr:", req.user)

      if (req.params.email) {
        User.findOne({email: req.params.email}, function (err, returnedUser) {

          if (err) {
            return res.status(401).json({'message': 'User not found', 'error': err});
          } else {
            return res.status(200).json({'success': true, 'user' : returnedUser});
          };
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

      var returnedUser = {
        _id: user._id,
        first: user.first,
        last: user.last,
        email: user.email,
        phone: user.phone,
        street: user.street,
        state: user.state,
        zip: user.zip,
        hospital: user.hospital,
        pets: user.pets,
        reservations: user.reservations,
        admin: user.admin,
        isLoggedIn: true,
        created_at: user.created_at
      };

      passport.authenticate('local')(req, res, function () {
        return res.send({
          'success': true,
          'user': returnedUser
        });
      });
    };
  });
});

router.post('/login', passport.authenticate('local'), function(req, res){

  console.log("LOGIN RESPONSE:", res);

  if (res.status === 401) {
    console.log("BAD CREDENTIALS", res);
    return res.status(401).json({'success': false, 'message': 'Invalid username or password.', 'isLoggedIn': false});
  };

  console.log("LOGIN: ", req.user);

  var returnedUser = {
    _id: req.user._id,
    first: req.user.first,
    last: req.user.last,
    email: req.user.email,
    phone: req.user.phone,
    street: req.user.street,
    state: req.user.state,
    zip: req.user.zip,
    hospital: req.user.hospital,
    pets: req.user.pets,
    reservations: req.user.reservations,
    admin: req.user.admin,
    isLoggedIn: true,
    created_at: req.user.created_at
  };

  return res.status(200).json({'user': returnedUser, 'isLoggedIn': true});
});

router.post('/update/', function (req, res){
  //GENERIC FIND ONE AND UPDATE ENDPOINT, TO REPLACE ADDPET/ADDRESS
  var updatedField = req.body.updatedField;
  var updatedFieldKey = '' + updatedField;

  var updatedUser = req.body;
  var query = {'username' : updatedUser.username};
  var newData = { $set : {updatedFieldKey : updatedUser.updatedField}}
  var updatedUser = User.findOneAndUpdate(query, newData, function(err, returnedUser){
      if (err) {
        return res.send(500, { error: err });
      } else {
        return returnedUser;
      };
  });

  if (err) {
    return res.status(500).json({'success': false, 'error':err});
  } else {
    return res.status(200).json({'success': true, 'updatedUser': returnedUser});
  } 
});


router.post('/addPet', function(req, res){

  var updatedUser = req.body;
    console.log("CALLED ADD PET TO USER: ", updatedUser, req.data); 
    console.log("RES BODY: ", res.body, res.data);
    console.log("QUERY TO DATABASE: ", updatedUser);
  var query = {'username': updatedUser.email};
    console.log("QUERYING THIS USER: ", query); 
  var newData = { $set : {'pets': updatedUser.pets}}
  var updatedUser = User.findOneAndUpdate(query, newData, function(err, returnedUser){
      if (err) {
        return res.status(500).json({'success': false, 'error':err});
      } else {
        return res.status(200).json({'success': true, 'updatedUser': returnedUser});
      };
  });
});

router.post('/addReservation', function(req, res){
  // TO DO: REFACTOR INTO SINGLE FUNCTION
  var updatedUser = req.body;
    console.log("UPDATED USER: ", updatedUser);

  var query = {'username': updatedUser.owner};
  var newData = { $set : {'reservations': updatedUser.updatedReservations}}
  var updatedUser = User.findOneAndUpdate(query, newData, function(err, returnedReservation){
      if (err) {
        return res.status(500).json({'success': false, 'error':err});
      } else {
        return res.status(200).json({'success': true, 'reservation': returnedReservation});
      };
  });
});

router.get('/logout', function(req, res){
  req.logout();
  console.log('Sucesfully logged out');
  return res.redirect('/');
});

module.exports = router;