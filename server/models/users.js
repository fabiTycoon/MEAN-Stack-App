var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  first: String,
  last: String,
  username: {type: String, required: true, unique: true},
  email: String,
  password: {type: String, required: true},
  phone: {type: String, required: true},
  street: String,
  city: String,
  state: String,
  zip: Number,
  hospital: String,
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
  admin: {type: Boolean, default: false}
});

var options = {
  usernameField: 'email'
};

UserSchema.plugin(passportLocalMongoose, options); 

var User = mongoose.model('User', UserSchema);

module.exports = User;