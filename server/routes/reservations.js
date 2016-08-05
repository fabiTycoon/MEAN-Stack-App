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

    console.log("ADD RESERVATION ENDPOINT: ", res);
    //EXPECTS RESERVATION OBJ + owner e-mail & array of existing user reservations

  var reservationObject = req.body;
  var userEmail = req.body.owner;
  var existingReservations = req.body.existingReservations;
  var newReservation = new Reservation(reservationObject);
  
  console.log("RESERVATION OBJECT: ", reservationObject);

  newReservation.save(function(err, pet){
    if (err) {
      console.log("ERROR: ", err);
      return res.status(500).json({'error': err, 'message': 'Please check that you\'ve filled in all required fields.'});
    } else {
      existingReservations.push(pet);
      return res.status(200).json({'reservation': reservation, 'updatedReservations': existingReservations, 'userEmail': userEmail});
    };
  });

});

router.put('/', function(req, res) {
  
});

router.delete('/', function(req, res) {
  
});

module.exports = router;