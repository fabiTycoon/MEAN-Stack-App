var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
  service: {type: String, required: true},
  checkInDate: {type: Date, required: true},
  checkOutDate: {type: Date, required: true},
  checkOutTime: String,
  checkInTime: String,
  bringingOwnFood: Boolean,
  returningGuest: Boolean,
  preferredContact: String,
  adminApproved: {type: Boolean, default: null},
  checkOutTime: String,
  owner: {type: String, required: true},
  ownerEmail: String,
  ownerPhone: String,
  pets: {type: Array, required: true},
  reminder: {type: Boolean, default: true}, 
  reminderMethod: String,
  created_at: {type: Date, default: Date.now}
});

var Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;