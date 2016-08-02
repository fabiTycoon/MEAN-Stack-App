var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');

// Serialize a user
passport.serializeUser(function (user, done) {
  console.log('passport serializeUser:', user);
  done(null, { 
    id: user.id
  });
});

// Deserialize a user
passport.deserializeUser(function (user, done) {
  console.log('passport deserializeUser:', user);
  User.findById(user.id)
  .then(function (user) {
    done(null, user);
  })
  .catch(function (err) {
    done(err, null);
  });
});


/*
passport.use('local-signup', new LocalStrategy(
  // We want to pass req.body so that we can get the additional fields at sign up, such as first name, last name
  { usernameField: 'username', passwordField: 'password', passReqToCallback: true },
  function (req, username, password, done) {
    var firstName = req.body.first,
        lastName = req.body.last,
        phone = req.body.phone,
        email = req.body.email,
        username = username,
        street = req.body.street,
        city = req.body.city,
        state = req.body.state,
        zip = req.body.zip,
        hospital = req.body.hospital;

    // Try to find the user first to check if they already have signed up
    User.findByEmail(email)
    .then(function (user) {
      // User already exists, we dont want to sign up
      console.log("User.findByEmail called, user is:", user);
      if (user) {
        //^^^ not sure about this
        done(null, false, { 'message': 'User already exists', 'user' : user });
        return;
      }
      // User doesnt exist, lets create a new one
      // Hash the password
      return User.generateHash(password);
    })
    // After hashing password, try to sign up
    .then(function (passHash) {

        console.log("HASHED PASSWORD: ", passHash);

      // Return a promise of the user sign up  - this is actual call to database signup method
      return User.signUp({
        username: username,
        password: passHash,
        email: email,
        first: firstName,
        last: lastName,
        phone: phone,
        email: email,
        street: street,
        zip: zip,
        hospital: hospital
      });
    })  
    // User successfully signed up
    .then(function (newUser) {
      return done(null, newUser, { message: 'Successfully signed up' });
    })
    .catch(function (err) {
      return done(null, false, { message: 'Error signing up'});
    });
  }
));*/