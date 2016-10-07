var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/users.js');
var passportLocalMongoose = require('passport-local-mongoose');
var nodemailer = require('nodemailer');


// ---------- NODEMAILER CONFIG ------------
var emailAccountString = 'npoling@gmail.com';
var passwordString = process.env.EMAIL_PASSWORD;

var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: emailAccountString,
    pass: passwordString //
  }
});

// ---------- E-MAIL HELPER FNS ----------
var sendNewUserEmail = function (email) {

  //TO DO - UPDATE PATH TO DYNAMIC VERIFICATION URL
  var mailOptions = {
    from: emailAccountString,
    to: email,
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


var sendEmail = function (emailConfig) {
  //SENT WHEN ADMIN USER CONFIRMS A RESERVATION

  var mailOptions = {
    from: emailAccountString,
    to: emailConfig.toEmail,
    subject: emailConfig.subjectString,
    generateTextFromHTML: true,
    html: emailConfig.bodyHtml  
  };

  smtpTransport.sendMail(mailOptions, function(error, res) {
    if (error) {
      console.log("FAILED TO SEND NEW EMAIL: ", error);
    } else {
      console.log("SENT NEW USER EMAIL: ", res);
    }
    smtpTransport.close();
  });
};

var sendNewUserEmailAdmin = function (user) {

  var emailConfig = {
    toEmail: emailAccountString,
    subjectString: 'NEW USER REGISTERED - ' + user.username + " - " + user.last + ", " + user.first,
    bodyHtml: "<h4>NEW USER: " + user.username +"</h4><br><p><strong>" + user.last + ", " + user.first + "</strong></p><br>"
  };

  emailConfig.bodyHtml += "<p>A new user has registered on HollistonMeadows.com!<br>Here's their information for your reference:</p>"

  emailConfig.bodyHtml += "<br><p><strong>PHONE: </strong>" + user.phone + "</p>";
  emailConfig.bodyHtml += "<p><strong>ADDRESS: </strong>" + user.street + "</p>";
  emailConfig.bodyHtml += "<p><strong>CITY: </strong>" + user.city + "</p>";
  emailConfig.bodyHtml += "<p><strong>STATE: </strong>" + user.state  + "</p>"
  emailConfig.bodyHtml += "<p><strong>ZIP: </strong>" + user.zip + "</p>";
  emailConfig.bodyHtml += "<p><strong>HOSPITAL: </strong>" + user.hospital + "</p>";
  emailConfig.bodyHtml += "<p><strong>REGISTERED AT: </strong>" + user.created_at + "</p>";

  sendEmail(emailConfig);

};

// ---------- END E-MAIL HELPER FNS ----------


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

router.get('/', function (req, res){
  //if (req.user && req.user.admin === true) {
/*
    var submittedId = req.body.user._id;
      console.log("USER ID: ", submittedId);

    User.findOne({email: req.body.user.email}, function (err, returnedUser) {
      if (err) {
        return res.status(500).json({'success': false, 'message': 'Database error', 'error': err});
      } else {
        if (returnedUser._id !== submittedId) {
          return res.status(401).json({'success': false, 'error': 'ID of requesting user doesn\'t match database value'});
        };
      };
    });*/

    User.find({}, function (err, returnedUsers){
      if (err) {
        return res.status(500).json({'success': false, 'error': err});
      } else {
          console.log("USERS FOUND!: ", returnedUsers)
        return res.status(200).json({'success': true, 'users': returnedUsers});
      };
    });

  //};

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


// ---------- NEW USER REGISTRATION FUNCTION ----------
router.post('/register', function(req, res) {
  
  console.log("registering user", req.body);
  console.log("THIS IS THE ZIP CODE: ", req.body.zip)

  if (req.body.password !== req.body.passwordConfirm) {
    console.log('error, passwords do not match');
    res.status(501).json({'message': 'Passwords do not match'});
    return;
  };
  //TO DO: ADDITIONAL USER VALIDATION

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
    hospital: req.body.hospital,
    admin: req.body.admin,
    pets: [],
    reservations: []
  }), password, function (err, user){

    if (err) {
      return res.send({
        'success': false,
        'error': err
      });
    } else {

      sendNewUserEmail(user.email);
      sendNewUserEmailAdmin(user);

      var returnedUser = {
        _id: user._id,
        first: user.first,
        last: user.last,
        email: user.email,
        phone: user.phone,
        street: user.street,
        city: user.city,
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
  if (userId) {
    console.log("HIT VERIFY USER ENDPOINT: ", userId);
  };

  User.findOne({_id: userId}, function (err, returnedUser) { 

    if (err) {
      return res.status(500).json({'success': false, 'err': err});
    };

    if (returnedUser) {
      returnedUser.verified = true;
      returnedUser.save();
      return res.status(201).json({'success': true, 'user': returnedUser});      
    } else {
      return res.status(401).json({'success': false, 'err': err, 'message': 'Failed to locate a user with this email.'});
    };
  });
});


router.post('/login', passport.authenticate('local'), function(req, res, next){

  var currentTime = Date.now();
/*  var registeredTime = req.user.created_at;
  var verificationGracePeriod = 10000000000000000000000000;

  if (req.user.verified === false) {
    if ((currentTime - registeredTime) > verificationGracePeriod) {
      //deactivate account
      return res.status(401).json({'success': false, err: 'Woops!  You didn\'t verify your e-mail address within 48 hours of registering.  TODO: Add way for user to resend verification email.'})
    };
  } else if (req.user.deactivated === true) {
    return res.status(401).json({'success': false, err: 'This account has been deactivated  Please contact us for more information.'})
  };*/

  //UPDATE LAST LOGIN VALUE:
  User.findOne({username: req.user.email}, function (err, returnedUser) { 
    if (err) {
      return res.status(500).json({'success': false, 'err': err});
    };

    if (returnedUser) {
      returnedUser.last_login = currentTime;
      returnedUser.save();     
    } else {
      return res.status(401).json({'success': false, 'err': err, 'message': 'Failed to locate a user with this email.'});
    };
  });

  var returnedUser = {
    first: req.user.first,
    last: req.user.last,
    username: req.user.username,
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
        sendNewReservationEmail(returnedReservation);
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