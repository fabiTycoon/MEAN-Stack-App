var express = require('express');
var bodyParser = require('body-parser');
var Path = require('path');

var port = process.env.PORT || 8080; 
var assetFolder = Path.resolve(__dirname, '../app/');

var app = express();
var router = express.Router();

router.use(express.static(assetFolder));

// parse application/json 
app.use(bodyParser.json());

// Mount our main router
app.use('/', router);

//Start the server
app.listen(port, function() {
    console.log('Listening on port %d in mode %s', port, app.get('env'));
  });

//Connect to the database
client.connect();

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
});

app.put('/user', function (req, res) {
  //update user info
  res.send();
})

app.delete('/user', function (req, res) {
  //delete a user
  res.send();
})

*/


// Default endpoint:

app.get('/*', function (req, res) {
  res.sendFile(assetFolder + '/index.html');
});


