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
var CronJob = require('cron');

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



//CRON JOBS:

var reservationReminderJob = cron.job("00 00 09 * * 1-5", function (){
  //check to see if there are upcoming reservations && they've asked for reminder
  //if sms or e-mail reminder, send reminders.
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


