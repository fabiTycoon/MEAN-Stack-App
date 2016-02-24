//this code expects Mongo to be installed
//and a db called 'pairLearning' to exist
var mongoose = require('mongoose');

var mongodb;
//Once we deploy this will become relevant

var config = {
  mongoUrl: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/holliston_test'
  //this url may or may not be incorrect
};

mongoose.connect(config.mongoUrl, function(err){
  if (err) {
    console.log('ERRAR MANGO PROBLEMS:', err);
  }
});

module.exports = mongoose;

