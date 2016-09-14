var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/users.js');
var passportLocalMongoose = require('passport-local-mongoose');
var nodemailer = require('nodemailer');

var emailAccountString = 'info@hollisonmeadows.com'
//var passwordString = process.env.EMAIL_PASSWORD;

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: emailAccountString,
    pass: 'userpass' //
  }
});


// ----- HANDLERS FOR CALLS TO API/USERS -----
router.get('user/:userEmail', function (req, res) {
  var userEmail = req.params.email;

    console.log("HIT GET USER ENDPOINT, EMAIL:", userEmail);
    console.log("HIT GET USER ENDPOINT:", req);

  User.findOne({username: userEmail}, function (err, returnedUser) {
    if (err) {
      return res.status(500).json({'success': false, 'error': err});
    } else {
      return res.status(200).json({'success': true, 'user': returnedUser});
    };
  }); 
});

router.get('users', function (req, res){
  if (req.user && req.user.admin === true ) {
    User.find({}, function (err, returnedUsers){
      if (err) {
        return res.status(500).json({'success': false, 'error': err});
      } else {
        return res.status(200).json({'success': true, 'users': returnedUsers});
      };
    });    
  };
});

router.get('/getUserByEmail/', function(req, res) {
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

var sendNewUserEmail = function (email) {

  var mailOptions = {
    from: emailAccountString
    to: email
    subject: "Welcome to Holliston Meadows!",
    generateTextFromHTML: true,
    html: "<h3>WELCOME!</h3<br><p>We're excited to have your pets stay with us!</p><br><p>Please click <a href='' target='_blank'>here</a> to verify your email!</p><br><br><p>&nbsp;&nbsp;&nbsp;Regards,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Holliston Meadows</p>"
  };

  smtpTransport.sendMail(mailOptions, function(error, res) {
    if (error) {
      console.log("FAILED TO SEND NEW USER EMAIL: ", error);
    } else {
      console.log("SENT NEW USER EMAIL: ", res);
    }
    smtpTransport.close();
  });
};

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
      });
    } else {

      sendNewUserEmail(user.email);

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

router.post('/verify/:userId', function (req, res) {
  var userId = req.params.userId;
  //TO DO: MAKE SURE THIS ISNT A BANNED EMAIL

  User.findOne({_id: userId}, function (err, returnedUser) { 

    if (err) {
      return res.status(500).json('success': false, 'err': err)
    };

    returnedUser.verified = true;
    returnedUser.save();
    return res.status(201).json('success': true, 'user': returnedUser);
  });

});

router.post('/login', passport.authenticate('local'), function(req, res){

  console.log("LOGIN RESPONSE:", res);

  if (res.status === 401) {
    console.log("BAD CREDENTIALS", res);
    return res.status(401).json({'success': false, 'message': 'Invalid username or password.', 'isLoggedIn': false});
  };

  console.log("LOGIN: ", req.user);

  var currentTime = Date.now();
  var registeredTime = req.user.created_at;

  if (req.user.verified === false) {

    if (currentTime - registeredTime > 100000000000000000000000) {
      //deactivate account

      return res. status(401).json({'success': false, err: 'Woops!  You didn\'t verify your e-mail address within 48 hours of registering.  TODO: Add way for user to resend verification email.'})
    };
  } else if (req.user.deactivated === true) {
    return res. status(401).json({'success': false, err: 'This account has been deactivated  Please contact us for more information.'})
  };


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
    last_login: currentTime,
    created_at: req.user.created_at,
    deactivated: false,
    verified: true
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
      return res.status(500).json({'success': false, 'error':err});
    } else {
      return res.status(200).json({'success': true, 'updatedUser': returnedUser});
    }; 
  });
});

var updateUserData = function (updatedData, databaseUser) {

  console.log(JSON.stringify(databaseUser));
  console.log(databaseUser);

};


router.put('/', function (req, res) {
    console.log("HIT EDIT USER ENDPOINT: ", req.body);

  var updatedUser = req.body;
      console.log("THESE ARE THE FIELDS BEING UPDATED: ", updatedUser);
  var fieldToUpdate = req.body.fieldToUpdate;
  var currentUsername = req.body.currentUsername;
  if (!updatedUser.username) {
    updatedUser.username = req.body.currentUsername;
    updatedUser.email = req.body.currentUsername;
  };

    console.log("HIT EDIT USER ENDPOINT, EDITING THIS:", fieldToUpdate);
    console.log("FINDING THIS USER: ", currentUsername);

  User.findOne({username: currentUsername}, function (err, returnedUser) { 
    console.log("FIND USER RETURNED THIS USER: ", returnedUser);
    if (err || !returnedUser) {
      console.log("FIND USER RETURNED THIS ERROR: ", err)
      return res.status(500).json({'message': 'Cannot find a user by that e-mail.', 'success': false, 'err': err})
    ;}

    if (fieldToUpdate === 'email') {
      //need to do someething to avoid mongoose throwing duplicate key error
    } else if (fieldToUpdate === 'phone') {
      returnedUser.phone = updatedUser.phone;
    } else if (fieldToUpdate === 'address') {
      returnedUser.street = updatedUser.street;
      returnedUser.city = updatedUser.city;
      returnedUser.state = updatedUser.state;
      returnedUser.zip = updatedUser.zip;
    } else if (fieldToUpdate === 'hospital') {
      returnedUser.hospital = updatedUser.hospital;
    } else if (fieldToUpdate === 'password') {
        return returnedUser.setPassword(req.body.password, function (){
          returnedUser.save();
          return res.status(200).json({message: 'password reset successful', success: true, user: returnedUser});
        });
    };
    console.log("SAVING THIS USER: ", JSON.stringify(returnedUser));
    returnedUser.save();
    return res.status(200).json({'user': returnedUser, 'success': true});
  });  
});

router.post('/toggleBanUser/', function (){
  var userEmail = req.data.userEmail;
    console.log("BANNING THIS USER: ", userEmail);

  //FIRST PULL USER FROM DB:
  //User.findOne('')
  var query = {'username' : userEmail};  
  var updatedUserData = {};

  User.findOne(query, function (err, data) {
    if (err) {
      console.log("ERROR COULDNT FIND ANYONE TO BAN :( : ", err);
      return res.status(500).json({'error': err, 'success': false});
    } else {    
      var updatedUserData = data;
      updatedUserData.deactivated = true;
      console.log("BANNING THIS USER: ", updatedUserData);  

      User.findOneAndUpdate(query, updatedUserData, {new: true}, function (err, data) {
        if (err) {
          console.log("ERROR: ", err);
          return res.status(500).json({'error': err, 'success': false});
        } else {
          console.log("SAVED UPDATED USER DATA: ", user);
          return res.status(200).json({'user': user, 'success': true});
        };
      });
    };
  });
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