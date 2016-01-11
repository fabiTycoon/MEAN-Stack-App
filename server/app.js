var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var db = require('./config/db');

var port = process.env.PORT || 8080; 

// parse application/json 
app.use(bodyParser.json());
