var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080; 
var assetFolder = Path.resolve(__dirname, '../app/');

// parse application/json 
app.use(bodyParser.json());


//Define API endpoints for users, pets, and reservations:

//User:
app.get('/user', function (req, res) {
  res.send()
});

app.post('/user', function (req, res) {
  //create a new user
  res.send()
});





app.get('/*', function (req, res) {
  res.sendFile(assetFolder + '/index.html');
});
