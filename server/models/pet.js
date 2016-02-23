var Mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PetSchema = new Schema({
  name: {type: String, required: true},
  breed: String,
  owner: {type: Number, required: true},
  weight: Number,
  color: String,
  age: Number,
  neutered: Boolean,
  //Array containing id's of reservations for this pet
  reservations: Array,
  foodBrand: String,
  foodServings: String,
  foodAllergies: String,
  comments: String,
  created_at: {type: Date, default: Date.now}
});

var Pet = Mongoose.model('Pet', PetSchema);

module.exports = Pet;