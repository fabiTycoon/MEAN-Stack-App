var db = require('../lib/db');
var pg = require('pg');
var bPromise = require('bluebird');
var nodemailer = require('nodemailer');
var bcrypt = bPromise.promisifyAll(require('bcrypt-nodejs'));
var password = require('../lib/password.js');
var email = require('../lib/mailer.js');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/holliston_dev';
var client = new pg.Client(connectionString);

var Users = {};

// returns all users
Users.all = function (req, res) {
  var results = [];

  pg.connect(connectionString, function (err, client, done){
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ 
        success: false, data: err
      });
    };
  });

  var query = client.query('SELECT * FROM USERS;');

  // Stream results back one row at a time
  query.on('row', function(row) {
    results.push(row);
  });

  query.on('end', function() { 
    client.end();
    return res.json(results);
  });
};

// finds by email and then calls the callback
Users.findByEmail = function (email, req, res) {
  var result = [];

  pg.connect(connectionString, function (err, client, done){
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ 
        success: false, data: err
      });
    };
  });

  var query = client.query('SELECT user.id' +
    'FROM users' + 
    'WHERE user.email =' + 
    email +
    ';'
    );

  // Stream result back
  query.on('row', function(row) {
    result.push(row);
  });

  query.on('end', function() { 
    client.end();
    return res.json(result);
  });
}

// finds by id and then calls the callback
Users.findById = function (id, req, res) {
  var result = [];

  pg.connect(connectionString, function (err, client, done){
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ 
        success: false, 
        data: err
      });
    };
  });

  var query = client.query('SELECT user.id' +
    'FROM users' + 
    'WHERE user.id =' + 
    id +
    ';'
    );

  // Stream result back one row at a time
  query.on('row', function(row) {
    result.push(row);
  });

  query.on('end', function() { 
    client.end();
    return res.json(result);
  });
};


// signs up a new user
Users.signUp = function (attrs, req, res) {

  //unpack user atts
  var User = {
    first: attrs.first,
    last: attrs.last,
    phone: attrs.phone,
    email: attrs.email,
    password: null,
    street: attrs.street,
    city: attrs.city,
    state: attrs.state,
    zip: attrs.zip,
    hospital: attrs.hopsital
  };

  pg.connect(connectionString, function (err, client, done) {
    //query db, check if user already exists
    var userExists = this.findByEmail(User.email);
    (userExists.length > 0) ? userExists = true: userExists = false;

    //if user doesn't exist, create new user
    //create temporary password & send to user:
    var temp = password.newPassword(8);
    email.sendMessage(User.email, temp);

    User.password = this.generateHash(temp);
    temp = null;

    var result = [];

    var query = client.query('INSERT INTO USERS ' +
      '(first, last, phone, email, password, street, city, state, zip, hospital) ' + 
      'VALUES (' +
        User.first + ', ' +
        User.last + ', ' +
        User.phone + ', ' +
        User.email + ', ' +
        User.password + ', ' +
        User.street + ', ' +
        User.city + ', ' +
        User.state + ', ' +
        User.zip + ', ' +
        User.hospital + ');'
      );
  });

  if (err) {
    done();
    console.log(err);
    return res.status(500).json({
      success: false, 
      data: err
    });
  };

  // Stream result back one row at a time
  query.on('row', function(row) {
    result.push(row);
  });

  query.on('end', function(){
    client.end();
    console.log("Succesfully created user");
    return res.json(result);
  });
};

Users.resetPassword = function (email) {
  //TO DO
  //find by email
  //generate new pass and email
  //update DB
}

Users.changePassword = function (email, password) {
  //TO DO
  //find by email
  //check old password
  //if valid, hash new password & send to db
}

// generates hash async
Users.generateHash = function (password) {
  // Use a work factor of 12 for hashing
  return bcrypt.genSaltAsync(12)
    .then(function(salt) {
      return bcrypt.hashAsync(password, salt, null)
      .then(function (passHash) {
        console.log('Salt:', salt, 'Passhash:', passHash);
        return passHash;
      });
    });
};

// checks password async with stored password
Users.validPassword = function(enteredPassword, passwordHash) {
  return bcrypt.compareAsync(enteredPassword, passwordHash);
};

module.exports = Users;