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

//LOCAL MODULES:
var Users = require('./models/users');
//var config = require('./lib/passport.js');
var userRoutes = require('./routes/users.js');
var petRoutes = require('./routes/pets.js');
var reservationRoutes = require('./routes/reservations.js');

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
app.use(morgan('dev'));
// Parse incoming cookies
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'many cats on a keyboard typing away',
    resave: false,
    saveUninitialized: false
}));

//set up passport for persistent sessions
app.use(passport.initialize());
app.use(passport.session({ secret: 'In tigers and tabbies, the middle of the tongue is covered in backward-pointing spines, used for breaking off and gripping meat.' }));
app.use(passport.session());

//Connect mongoose
var db = require('./lib/db');

//Configure passport-local to use users model for authentication
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

// Mount our main router & API routers
app.use('/', router);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/bookings', reservationRoutes);

//Start the server
app.listen(port, function() {
    console.log('Listening on port %d in mode %s', port, app.get('env'));
  });

//TERMINAL ENDPOINT:
app.get('/*', function (req, res) {
  res.sendFile(assetFolder + '/index.html');
});


