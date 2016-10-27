//NPM MODULES:
var express = require('express');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var cron = require('cron');
var sms = ('./lib/sms.js');
var email = ('./lib/mailer.js');

//PATHS:
var port = process.env.PORT || 8080; 
var assetFolder = path.resolve(__dirname, '../app/');

//APPLICATION LOGIC:
var app = express();
var router = express.Router();
//make sure to serve static files before session middleware:
app.use(express.static(assetFolder));

// parse application/json 
app.use(bodyParser.urlencoded({ extended: true }) );
app.use(bodyParser.json());
//log requests to the console
//app.use(express.logger());
app.use(morgan('dev'));
// Parse incoming cookies
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'many fluffly snuggle cats on a keyboard typing away',
    resave: false,
    saveUninitialized: false
}));

//set up passport for persistent sessions
app.use(passport.initialize());
app.use(passport.session({ secret: 'In tigers and tabbies, the middle of the tongue is covered in backward-pointing spines, used for breaking off and gripping meat.' }));
app.use(passport.session());

//Configure passport-local to use users model for authentication
var Users = require('./models/users');
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

//Connect mongoose & load passport settings
var db = require('./lib/db');
//var config = require('./lib/passport.js');

var userRoutes = require('./routes/users.js');
var petRoutes = require('./routes/pets.js');
var reservationRoutes = require('./routes/reservations.js');


// Mount our main router & API routers
app.use('/', router);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/bookings', reservationRoutes);

//Start the server
app.listen(port, function() {
    console.log('Listening on port %d in mode %s', port, app.get('env'));
  });



//CRON JOBS & HELPER FNS:

var getReservations = function (callback) {

  var reservationEndpoint = '';

  //NOT SURE THAT THESE ROUTES ARE 100%:
  if (app.get('env') === 'development') {
    reservationEndpoint = '#/reservations';
  } else {
    reservationEndpoint = 'http://wwww.hollistonmeadows.com/#/api/bookings';
  };

  request(reservationEndpoint, function (error, res, body) {
    if (!error && res.statusCode == 200) {
        console.log("HIT RESERVATION ENDPOINT FROM GET RESERVATIONS: ", res);
        console.log("HIT RESERVATION ENDPOINT FROM GET RESERVATIONS: ", res.reservations);
      return res.reservations; 
    } else if (error) {
      return res.status(500).json({'success': false, 'error': error, 'err': err});
    };
  })
};

var emailPhoneReminders = function (reservations) {
   var emailConfig = {
        toEmail: 'info@hollistonmeadows.com',
        subjectString: 'UPCOMING RESERVATIONS - PHONE REMINDER REQUESTED',
        bodyHtml: '<h3>TODAY\'S REMINDERS:</h3><br><p>The following customers have requested a reminder about their upcoming stay at Holliston Meadows.  Please call these customers as soon as possible and politely remind them of their upcoming appointment:'
      };  

      //TO DO: APPEND HTML TABLE OF RESERVATIONS:

      email.sendEmail(emailConfig);
};


var reservationReminderJob = new cron.CronJob("00 30 07 * * 1-7", function () {
  //fn runs every weekday at 7:30am
  var reservations = getReservations();
    console.log("PULLED RESERVATIONS CRON JOB TASK: ", reservations);
}, function () {
  //runs once job stops

  if (reservations.length > 0) {
    for (var i = 0; i < reservations.length; i++) {

      var today = Date.now(); 
      var emailReminders = [];
      var textRemindersBoarding = [];
      var textRemindersDaycare = [];
      var phoneReminders = [];

      var timeDifference = reservations[i].checkInDate - today;



      if (reservations[i].reminder && timeDifference <= 129600000) { //36 hrs

        var reminderMethod = reservations[i].reminderMethod;

        if (reminderMethod === 'email') {
          emailReminders.push(reservations[i]);
        } else if (reminderMethod === 'text') {

            if (reservations[i].service === 'boarding') {
              textRemindersBoarding.push(reservations[i]);
            } else if (reservations[i].service === 'daycare') {
              textRemindersDaycare.push(reservations[i]);            
            };

        } else if (reminderMethod === 'phone'){
         phoneReminders.push(reservations[i]);
        };  

      sms.sendDayCareReminders(textRemindersDaycare);
      sms.sendBoardingReminders(textRemindersBoarding);
      emailPhoneReminders(reservations);
    };
  };
}; 



});

//START CRON JOBS:
reservationReminderJob.start();

// ERROR HANDLERS:
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log("ERROR: ", err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
});

//TERMINAL ENDPOINT:
app.get('/*', function (req, res) {
  res.sendFile(assetFolder + '/index.html');
});


