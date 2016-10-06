var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Reservation = require('../models/reservation.js');
var nodemailer = require('nodemailer');


// ---------- NODEMAILER CONFIG ------------
var emailAccountString = 'npoling@gmail.com';
var passwordString = process.env.EMAIL_PASSWORD;

var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: emailAccountString,
    pass: passwordString //
  }
});

// ------------ EMAIL HELPER FN ------------
var sendEmail = function (emailConfig) {
  //SENT WHEN ADMIN USER CONFIRMS A RESERVATION

  var mailOptions = {
    from: emailAccountString,
    to: emailConfig.toEmail,
    subject: emailConfig.subjectString,
    generateTextFromHTML: true,
    html: emailConfig.bodyHtml  
  };

  smtpTransport.sendMail(mailOptions, function(error, res) {
    if (error) {
      console.log("FAILED TO SEND NEW EMAIL: ", error);
    } else {
      console.log("SENT NEW USER EMAIL: ", res);
    }
    smtpTransport.close();
  });
};

var sendNewReservationEmailAdmin = function (reservation) {

    console.log("SENDING EMAIL FOR THIS RES: ", reservation);

  var serviceString = "",
   petString = "",
   reminderString = "";

  if (reservation.service === 'boarding') {
    serviceString = "Boarding";
  } else if (reservation.service === 'daycare') {
    serviceString = "Daycare";
  };

  if (reservation.reminder === true) {
    reminderString = "YES";
  } else if (reservation.reminder === false) {
    reminderString = "NO";
  };

  if (reservation.pets.length = 1) {
    petString += reservation.pets[0].name
  } else if (reservation.pets.length > 1) {

    for (var i = 0; i < reservation.pets.length; i++) {
      if (petString === "") {
        petString += reservation.pets[0].name;
      } else {
        petString += ", ";
        petString += reservation.pets[i].name;
      };
    };
  };

    console.log("SET PETSTRING: ", petString);

  var recipientEmail = emailAccountString;
  var subject = "NEW RESERVATION REQUEST - " + reservation.ownerName + " - " + serviceString;
  var bodyText = "<h4>NEW RESERVATION REQUEST: " + serviceString +"</h4><br><p><strong>";

    if (reservation.service === 'boarding') {
      bodyText += "REQUESTED DATES: </strong>" + reservation.checkInDate + " - " + reservation.checkOutDate + "</p>";
    } else if (reservation.service === 'daycare') {
      bodyText += "REQUESTED DATE: </strong>" + reservation.checkInDate + "</p>";
    };

    bodyText += "<br><p><strong>EST. CHECK-IN TIME: </strong>" + reservation.checkInTime + "</p>";
    bodyText += "<br><p><strong>EST CHECK-OUT TIME: </strong>" + reservation.checkOutTime + "</p>";
    bodyText += "<br><p><strong>OWNER NAME: </strong>" + reservation.ownerName + "</p>";
    bodyText += "<br><p><strong>PETS: </strong>" + petString  + "</p>"
    bodyText += "<br><p><strong>REMIND 24HRS IN ADVANCE?: </strong>" + reminderString + "</p>";
    bodyText += "<br><p><strong>PREFERRED CONTACT METHOD: </strong>" + reservation.reminderMethod + "</p>";
    bodyText += "<br><p><strong>CONTACT PHONE: </strong>" + reservation.reminderMethod + "</p>";
    bodyText += "<br><p><strong>CONTACT EMAIL: </strong>" + reservation.owner + "</p>";

      console.log("SENDING EMAIL: ", recipientEmail, subject, bodyText);

      var emailConfig = {
        toEmail: recipientEmail,
        subjectString: subject,
        bodyHtml: bodyText
      };

    sendEmail(emailConfig);
};


//handler for calls to api/bookings
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
      sendNewReservationEmailAdmin(reservationObject);
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