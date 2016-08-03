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
    console.log("PET OBJECT: ", petObject);

  var userEmail = req.body.owner;
  var existingPets = req.body.existingPets;




  var newPet = new Pet(petObject);

  newPet.save(function(err, pet){
    if (err) {
      console.log("ERROR: ", err);
      return res.status(500).json({'error': err, 'message': 'Please check that you\'ve filled in all required fields.'});
    } else {

      //ADD PET TO USER:
      existingPets.push(pet);
      var query = {'pets': req.user.pets};
      req.newData.pets = existingPets;
      var updatedUser = User.findOneAndUpdate(query, req.newData, {upsert:true}, function(err, returnedUser){
          if (err) {
            return res.send(500, { error: err });
          } else {
            return returnedUser
            console.log("ADDED PET TO USER: ", returnedUser);
          }
      });
      //TO DO: INSURE THAT rootScope.user updates with new pets array when service receives this data
      return res.status(200).json({'pet': pet, 'updatedPets': existingPets, 'updatedUser': updatedUser});
    };
  });
});

router.put('/', function(req, res) {


});

router.delete('/', function(req, res) {
  
});

module.exports = router;