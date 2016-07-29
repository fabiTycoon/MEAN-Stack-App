var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
  service: {type: String, required: true},
  checkInDate: {type: Date, required: true},
  checkOutTime: {type: Date, required: true},
  checkInTime: {type: String, required: true},
  checkOutTime: {type: String, required: true},
  owner: {type: String, required: true}
});

var Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;