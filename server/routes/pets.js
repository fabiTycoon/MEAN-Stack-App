var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pet = require('../models/pet.js');

//handler for calls to api/pets
router.get('/', function(req, res) {
  Pet.find(function(err, pets) {
    if (err) {
      console.log("ERROR:", err);
      return;
    } else {
      return res.status(200).json({data: pets});
    };
  })
});

router.post('/', function(req, res) {
  var petObject = req.body;
    console.log("PET OBJECT: ", petObject);
    console.log("OWNER: ", req.user);
  petObject.owner = req.user.username;
    console.log("OWNER USERNAME: ", req.user.username);

    var newPet = new Pet(petObject);

    newPet.save(function(err, pet){
      if (err) {
        console.log("ERROR: ", err);
        return res.status(500).json({data: err});
      } else {
        return res.status(200).json({data: pet})
      }
    });
});

router.put('/', function(req, res) {
  
});

router.delete('/', function(req, res) {
  
});

module.exports = router;