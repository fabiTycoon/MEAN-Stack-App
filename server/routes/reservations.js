var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Reservation = require('../models/reservation.js');


//handler for calls to api/reservations
router.get('/', function(req, res) {
  Reservation.find(function(err, reservations) {
    if (err) {
      console.log("ERROR:", err);
      return;
    } else {
      return res.status(200).json({data: reservations});
    };
  })
});

router.post('/new', function(req, res) {

  //SEND RES TO DATABASE & RETURN SUCCESS OR ERROR

  var userObject = req.body.user;
  var reservationObject = req.body.reservation;
    console.log("HIT BACKEND: ", reservationObject);
    console.log("HIT BACKEND: ", userObject);

  var newReservation = new Reservation({
    service: reservationObject.serviceSelected,
    checkInDate: reservationObject.checkInDate,
    checkOutDate: reservationObject.checkOutDate,
    checkInTime: reservationObject.checkInTime,
    checkOutTime: reservationObject.checkOutTime,
    owner: userObject,
    pets: reservationObject.petsArray
  }); 

  newReservation.save(function(err){
    if (err) {
      console.log("RESERVATION ERROR: ", err);
      return res.status(500).json({error: err})
    } else {
      console.log("RESERVATION CREATED")
      return res.status(200).json({message: 'Reservation created.'})
    }
  })


});

router.put('/', function(req, res) {
  
});

router.delete('/', function(req, res) {
  
});

module.exports = router;