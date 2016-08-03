var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pet = require('../models/pet.js');
var User = require('../models/users.js');

//handler for calls to api/pets
/*router.get('/', function(req, res) {
  Pet.find(function(err, pets) {
    if (err) {
      console.log("ERROR:", err);
      return;
    } else {
      return res.status(200).json({data: pets});
    };
  })
});*/

router.post('/', function(req, res) {

    console.log("ADD PETS ENDPOINT: ", res);

  var petObject = req.body;
  var userEmail = req.body.owner;
  var existingPets = req.body.existingPets;
  var newPet = new Pet(petObject);
  

  console.log("PET OBJECT: ", petObject);

  newPet.save(function(err, pet){
    if (err) {
      console.log("ERROR: ", err);
      return res.status(500).json({'error': err, 'message': 'Please check that you\'ve filled in all required fields.'});
    } else {
      existingPets.push(pet);
      return res.status(200).json({'pet': pet, 'updatedPets': existingPets, 'userEmail': userEmail});
    };
  });
});

router.put('/', function(req, res) {


});

router.delete('/', function(req, res) {
  
});

module.exports = router;