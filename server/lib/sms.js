var twilio = require('twilio');
var accountSid = process.env.TWILIO_ACCOUNT_SID || '';
var token = process.env.TWILIO_AUTH_TOKEN || '';
var twilioNumber = 'YOUR_TWILIO_NUMBER';
var client = twilio(accountSid, token);

var smsHelpers = function () {
  return {
    sendReminder: function (userData) {
      // Send the text message.
      client.sendMessage({
        to: userData.contactPhone,
        from: twilioNumber,
        body: userData.bodyMessage
      });
    },
    sendDayCareReminders: function (reminderList) {
      //reminder list is an array of reservation objects
      for (var i = 0; i < reminderList.length; i++) {

        var userData = {};
        userData.contactPhone = "+" + reminderList[i].ownerPhone;  
        userData.appointmentDate = reminderList[i].checkInDate; 
        userData.bodyMessage = "This is a reminder that you have a daycare appointment scheduled tomorrow for your ";
        
        if (reminderList[i].pets.length > 1) {
          userData.bodyMessage += "pets ";
        } else {
          userData.bodyMessage += "pet ";
        };
        userData.bodyMessage += "at Holliston Meadows Pet Resort.  If you need to make any changes to your reservation, please call us at 508-429-1500."
        sendReminder(userData);
      };
    },

    sendBoardingReminders: function (reminderList) {
      //reminder list is an array of reservation objects
      for (var i = 0; i < reminderList.length; i++) {

        var userData = {};
        userData.contactPhone = reminderList[i].ownerPhone;  //THIS WILL NEED TO BE ADDED TO THE REMINDER LIST BEFORE THIS FN IS CALLED
        userData.appointmentDate = reminderList[i].checkInDate; 
        userData.bodyMessage = "This is a reminder that your ";
        
        if (reminderList[i].pets.length > 1) {
          userData.bodyMessage += "pets have";
        } else {
          userData.bodyMessage += "pet has";
        };
        userData.bodyMessage += " an upcoming stay tommorrow at Holliston Meadows Pet Resort.  If you need to make any changes to your reservation, please call us at 508-429-1500."
        sendReminder(userData);
      };
    }
  };
};

module.exports = smsHelpers();

 





