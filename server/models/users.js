var db = require('../lib/db');
var pg = require('pg');
var bPromise = require('bluebird');

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

  var query = client.query('SELECT user.id' +
    'FROM users' + 
    'WHERE user.email =' + 
    email +
    ';'
    );

  // Stream results back one row at a time
  query.on('row', function(row) {
    results.push(row);
  });

  query.on('end', function() { 
    client.end();
    return res.json(results);
  });
}

// finds by id and then calls the callback
Users.findById = function (id, cb) {
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

  var query = client.query('SELECT user.id' +
    'FROM users' + 
    'WHERE user.id =' + 
    id +
    ';'
    );

  // Stream results back one row at a time
  query.on('row', function(row) {
    results.push(row);
  });

  query.on('end', function() { 
    client.end();
    return res.json(results);
  });
};


// signs up a new user
Users.signUp = function (attrs) {

};

// generates hash async
Users.generateHash = function(password) {

};

// checks password async with stored password
Users.validPassword = function(enteredPassword, passwordHash) {
  
};

module.exports = Users;