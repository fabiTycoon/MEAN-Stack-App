var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');

// Serialize a user
passport.serializeUser(function (user, done) {
  console.log('passport serializeUser:', user);
  done(null, { 
    id: user.id, 
    first: user.first, 
    last: user.last, 
    phone: user.phone, 
    email: user.email,
    street: user.street,
    city: user.city,
    state: user.state,
    zip: user.zip,
    hospital: user.hospital
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

passport.use('local-signup', new LocalStrategy(
  // We want to pass req.body so that we can get the additional fields at sign up, such as first name, last name
  { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
  function (req, username, password, done) {
    var firstName = req.body.first,
        lastName = req.body.last,
        phone = req.body.phone,
        email = req.body.email,
        street = req.body.street,
        city = req.body.city,
        state = req.body.state,
        zip = req.body.zip,
        hospital = req.body.hospital;


    // Try to find the user first to check if they already have signed up
    User.findByEmail(username)
    .then(function (user) {
      // User already exists, we dont want to sign up
      if (user) {
        //^^^ not sure about this
        done(null, false, { message: 'User already exists' });
        return;
      }
      // User doesnt exist, lets create a new one
      // Hash the users supplied password
      return User.generateHash(password);
    })
    // After hashing password, try to sign up
    .then(function (passHash) {
      // Return a promise of the user sign up
      return User.signUp({
        email: username,
        password: passHash,
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
));