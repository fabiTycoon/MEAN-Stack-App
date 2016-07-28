var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PetSchema = new Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  breed: String,
  owner: {type: Number, required: true},
  weight: Number,
  color: String,
  age: Number,
  neutered: Boolean,
  foodBrand: String,
  foodServings: String,
  foodAllergies: String,
  comments: String,
  created_at: {type: Date, default: Date.now}
});

var Pet = mongoose.model('Pet', PetSchema);

module.exports = Pet;