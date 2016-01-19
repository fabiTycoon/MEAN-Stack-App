var express = require('express');
var bodyParser = require('body-parser');
var Path = require('path');
var pg = require('pg');

var app = express();
var router = express.Router();

var port = process.env.PORT || 8080; 
var assetFolder = Path.resolve(__dirname, '../app/');

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

// Connect to database:

app.get('/db', function (req, res){
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    //for now, just return dummy data when we access via /db
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
        { console.error(err); response.send("Error " + err);
      } else { 
        response.render('pages/db', {results: result.rows}); 
      }
    });
  });
});

