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
var cron = require('cron');
var http = require('http');

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

    return http.get({
        //host: 'hollistonmeadows.com',
        path: '/bookings'
    }, function(res) {
        // explicitly treat incoming data as utf8 (avoids issues with multi-byte chars)
        res.setEncoding('utf8');

        // incrementally capture the incoming response body
        var body = '';
        res.on('data', function(d) {
            body += d;
        });

        // do whatever we want with the response once it's done
        res.on('end', function() {
            try {
                var parsed = JSON.parse(body);
            } catch (err) {
                console.error('Unable to parse response as JSON', err);
                return callback(err);
            }

            // pass the relevant data back to the callback
            callback(null, {
                reservations: parsed.reservations
            });
        });
    }).on('error', function(err) {
        // handle errors with the request itself
        console.error('Error with the request:', err.message);
        callback(err);
    });
};

var reservationReminderJob = new cron.CronJob("00 30 07 * * 1-5", function () {
  //fn runs every weekday at 7:30am
  var retrievedReservations = function (reservations) {
    //not sure about this...
    getReservations(reservations);
  };

}, function () {
  //runs once job stops


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


