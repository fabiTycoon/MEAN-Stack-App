var db = require('../lib/db');

var Pet = {};

// finds by id and then calls the callback
Pet.findById = function(id, cb) {

};

// returns all Pets for a user and calls a callback
Pet.findByUser = function (user_id, cb) {
  
};

//returns all Pets for a reservation and calls a callback
Pet.findByReservation = function(reservation_id, cb) {
  
}

// creates a new Pet instance
Pet.create = function (attrs) {
  
};

module.exports = Pet;