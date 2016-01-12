var db = require('../lib/db');

var User = {};

// returns all users
User.all = function () {

}

// finds by email and then calls the callback
User.findByEmail = function (email, cb) {

}

// finds by id and then calls the callback
User.findById = function (id, cb) {

};


}

// signs up a new user
User.signUp = function (attrs) {
   var userAttrs = {
    email: attrs.email,
    password: attrs.password,
    first: attrs.first,
    last: attrs.last
    //etc etc
  };
  
};

// generates hash async
User.generateHash = function(password) {

};

// checks password async with stored password
User.validPassword = function(enteredPassword, passwordHash) {
  
};

module.exports = User;