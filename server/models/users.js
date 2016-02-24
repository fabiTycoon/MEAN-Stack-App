var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  first: String,
  last: String,
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  phone: {type: Number, required: true},
  street: String,
  city: String,
  state: String,
  zip: Number,
  hospital: String,
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
  admin: Boolean
});

var options = {
  usernameField: 'email'
}

UserSchema.plugin(passportLocalMongoose, options); 

var User = mongoose.model('User', UserSchema);

module.exports = User;