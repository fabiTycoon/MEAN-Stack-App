var express = require('express');
var bodyParser = require('body-parser');
var Path = require('path');

var app = express();
var router = express.Router();

var port = process.env.PORT || 8080; 
var assetFolder = Path.resolve(__dirname, '../');

router.use(express.static(assetFolder));

// parse application/json 
app.use(bodyParser.json());

// Mount our main router
app.use('/', router);

//Start the server
app.listen(port, function() {
    console.log('Listening on port %d in mode %s', port, app.get('env'));
  });

// SERVE APPLICATION FILES:


/*
//Define API endpoints for users, pets, and reservations:

//User:
app.get('/user', function (req, res) {
  res.send()
});

app.post('/user', function (req, res) {
  //create a new user
  res.send()
});*/








// Default endpoint:

app.get('/*', function (req, res) {
  res.sendFile(assetFolder + '/index.html');
});
