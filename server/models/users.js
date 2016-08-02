var db = '../lib/db.js';
var mongoose = require('mongoose');
var bPromise = require('bluebird');
var bcrypt = bPromise.promisifyAll(require('bcrypt-nodejs'));
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new Schema({
  first: String,
  last: String,
  username: {type: String, required: true, unique: true},
  email: String,
  password: String,
  phone: {type: String, required: true},
  street: String,
  city: String,
  state: String,
  zip: Number,
  hospital: String,
  pets: Array,
  reservations: Array,
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
  admin: {type: Boolean, default: false}
});
/*
var options = {
  usernameField: 'email'
};
*/
//UserSchema.plugin(passportLocalMongoose, options);
UserSchema.plugin(passportLocalMongoose); 

var User = mongoose.model('User', UserSchema);

User.findByEmail = function (email) {
  return;
};

module.exports = User;