var Mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
  service: {type: String, required: true},
  checkIn: {type: Date, required: true},
  checkOut: {type: Date, required: true},
  checkInTime: {type: Date, required: true},
  checkOutTime: {type: Date, required: true},
  owner: {type: Array, required: true},
  pets: {type: Array, required: true}
});

var Reservation = Mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;