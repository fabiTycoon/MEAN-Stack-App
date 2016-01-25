var db = require('../lib/db');
var pg = require('pg');
var bPromise = require('bluebird');
var bcrypt = bPromise.promisifyAll(require('bcrypt-nodejs'));

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
Users.findByEmail = function (email, cb) {
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

  // Stream result back one row at a time
  query.on('row', function(row) {
    result.push(row);
  });

  query.on('end', function() { 
    client.end();
    return res.json(result);
  });
}

// finds by id and then calls the callback
Users.findById = function (id, cb) {
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
Users.signUp = function (attrs) {

  var User = {
    first: attrs.first,
    last: attrs.last,
    phone: attrs.phone,
    email: attrs.email,
    street: attrs.street,
    city: attrs.city,
    state: attrs.state,
    zip: attrs.zip,
    hospital: attrs.hopsital
  };

  pg.connect(connectionString, function (err, client, done) {
    //unpack user atts & format into query for db
    //query db, check if user already exists

    if (this.findByEmail(User.email)) {

    }

    //validate user data
    //if valid


  });

  if (err) {
    done();
    console.log(err);
    return res.status(500).json({
      success: false, 
      data: err
    });
  };

  query.on('end', function(){
    client.end();
    return res.json(result);
  });
};

// generates hash async
Users.generateHash = function(password) {

};

// checks password async with stored password
Users.validPassword = function(enteredPassword, passwordHash) {
  
};

module.exports = Users;