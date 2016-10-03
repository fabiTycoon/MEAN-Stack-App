var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Reservation = require('../models/reservation.js');


//handler for calls to api/reservations
router.get('/', function(req, res) {

    //if (req.user && req.user.admin === true) {
  /*
      var submittedId = req.body.user._id;
        console.log("USER ID: ", submittedId);

      User.findOne({email: req.body.user.email}, function (err, returnedUser) {
        if (err) {
          return res.status(500).json({'success': false, 'message': 'Database error', 'error': err});
        } else {
          if (returnedUser._id !== submittedId) {
            return res.status(401).json({'success': false, 'error': 'ID of requesting user doesn\'t match database value'});
          };
        };
      });*/
      console.log("HIT RES END POINT")

      Reservation.find({}, function (err, returnedReservations){
        if (err) {
          return res.status(500).json({'success': false, 'error': err});
        } else {
            console.log("RESERVATIONS FOUND!: ", returnedReservations)
          return res.status(200).json({'success': true, 'reservations': returnedReservations});
        };
      });

    //};




});

router.post('/approveRes/:reservationId', function (res, res) {


    //TO DO: FIND RESERVATION IN DB & UPDATE; UPDATE USER RESERVATIONS OBJECT THEN RETURN

});

router.post('/new', function(req, res) {

    console.log("ADD RESERVATION ENDPOINT: ", res);
    //EXPECTS RESERVATION OBJ + owner e-mail & array of existing user reservations

  var reservationObject = req.body;
  var userEmail = req.body.owner;
  var existingReservations = req.body.existingReservations;
  var newReservation = new Reservation(reservationObject);
  
    console.log("RESERVATION OBJECT: ", reservationObject);
    console.log("EXISTING RESERVATIONS WERE: ", reservationObject.existingReservations);

  newReservation.save(function(err, returnedReservation){
    if (err) {
      console.log("ERROR: ", err);
      return res.status(500).json({'success': false, 'error': err, 'message': 'Please check that you\'ve filled in all required fields.'});
    } else {
      existingReservations.push(returnedReservation);
        console.log("SHOULD HAVE ALL RESERVATIONS NOW: ", existingReservations);
      return res.status(200).json({'success': true, 'reservation': returnedReservation, 'updatedReservations': existingReservations, 'userEmail': userEmail});
    };
  });

});

router.put('/', function(req, res) {
  
});

router.delete('/', function(req, res) {
  
});

module.exports = router;