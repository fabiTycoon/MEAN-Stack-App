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
  zip: String,
  hospital: String,
  pets: Array,
  reservations: Array,
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
  last_login: Date,
  deactivated: {type: Boolean, default: false},
  admin: Boolean,
  verified: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose); 
var User = mongoose.model('User', UserSchema);

module.exports = User;