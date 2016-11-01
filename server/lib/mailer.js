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



var emailHelpers = function () {
  return {

    


    // ---------- E-MAIL HELPER FNS ----------
    sendNewUserEmail: function (email) {

      //TO DO - UPDATE PATH TO DYNAMIC VERIFICATION URL
      var mailOptions = {
        from: emailAccountString,
        to: email,
        subject: "Welcome to Holliston Meadows!",
        generateTextFromHTML: true,
        html: "<h3>WELCOME!</h3<br><p>We're excited to have your pets stay with us!</p><br><p>Please click <a href='' target='_blank'>here</a> to verify your email!</p><br><br><p>&nbsp;&nbsp;&nbsp;Regards,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Holliston Meadows</p>"
      };

      smtpTransport.sendMail(mailOptions, function(error, res) {
        if (error) {
          console.log("FAILED TO SEND NEW USER EMAIL: ", error);
        } else {
          console.log("SENT NEW USER EMAIL: ", res);
        }
        smtpTransport.close();
      });
    },


    sendEmail: function (emailConfig) {
      //SENT WHEN ADMIN USER CONFIRMS A RESERVATION
        console.log("SENDING EMAIL FROM MAILER.JS: ", emailConfig);

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
    },

    sendNewUserEmailAdmin: function (user) {

      var emailConfig = {
        toEmail: emailAccountString,
        subjectString: 'NEW USER REGISTERED - ' + user.username + " - " + user.last + ", " + user.first,
        bodyHtml: "<h4>NEW USER: " + user.username +"</h4><br><p><strong>" + user.last + ", " + user.first + "</strong></p><br>"
      };

      emailConfig.bodyHtml += "<p>A new user has registered on HollistonMeadows.com!<br>Here's their information for your reference:</p>"

      emailConfig.bodyHtml += "<br><p><strong>PHONE: </strong>" + user.phone + "</p>";
      emailConfig.bodyHtml += "<p><strong>ADDRESS: </strong>" + user.street + "</p>";
      emailConfig.bodyHtml += "<p><strong>CITY: </strong>" + user.city + "</p>";
      emailConfig.bodyHtml += "<p><strong>STATE: </strong>" + user.state  + "</p>"
      emailConfig.bodyHtml += "<p><strong>ZIP: </strong>" + user.zip + "</p>";
      emailConfig.bodyHtml += "<p><strong>HOSPITAL: </strong>" + user.hospital + "</p>";
      emailConfig.bodyHtml += "<p><strong>REGISTERED AT: </strong>" + user.created_at + "</p>";

      sendEmail(emailConfig);

    },

    sendNewReservationEmailAdmin: function (reservation) {

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
        bodyText += "<br><p><strong>CONTACT PHONE: </strong>" + reservation.ownerPhone + "</p>";
        bodyText += "<br><p><strong>CONTACT EMAIL: </strong>" + reservation.ownerEmail + "</p>";

          console.log("SENDING EMAIL: ", recipientEmail, subject, bodyText);

          var emailConfig = {
            toEmail: recipientEmail,
            subjectString: subject,
            bodyHtml: bodyText
          };

        sendEmail(emailConfig);
    }
  };
};

module.exports = emailHelpers();

// ---------- END E-MAIL HELPER FNS ----------