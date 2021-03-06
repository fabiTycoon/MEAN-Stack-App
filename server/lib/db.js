var mongoose = require('mongoose');
var mongoString = ('./dbconfig');

var mongodb;
//Once we deploy this will become relevant

var config = {
  mongoUrl: process.env.PROD_MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/holliston_test'
};

console.log("SET DB URL:", config.mongoUrl);

mongoose.connect(config.mongoUrl, function(err){
  if (err) {
    console.log('ERRAR MANGO PROBLEMS:', err);
  }
});

module.exports = mongoose;