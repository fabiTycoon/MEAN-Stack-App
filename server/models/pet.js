var db = require('../lib/db');

var Pet = {};

// finds by id and then calls the callback
Pet.findById = function(pet_id, cb) {
  var results = [];

  pg.connect(connectionString, function (err, client, done){
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ 
        success: false, data: err
      });
    };
  });

  var query = client.query('SELECT * FROM pets' + 
    'WHERE pets.id = ;' + pet_id; 
    );

  // Stream results back one row at a time
  query.on('row', function(row) {
    results.push(row);
  });

  query.on('end', function() { 
    client.end();
    return res.json(results);
  });
};

// returns all Pets for a user and calls a callback
Pet.findByUser = function (user_id, cb) {
  var results = [];

  pg.connect(connectionString, function (err, client, done){
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ 
        success: false, data: err
      });
    };
  });

  var query = client.query('SELECT * FROM pets INNER JOIN users ON pets.owner = users.id ' + 
    'WHERE users.id = ;' + user_id; 
    );

  // Stream results back one row at a time
  query.on('row', function(row) {
    results.push(row);
  });

  query.on('end', function() { 
    client.end();
    return res.json(results);
  });
};

//returns all Pets for a reservation and calls a callback
Pet.findByReservation = function(reservation_id, cb) {
    
}

// creates a new Pet instance
Pet.create = function (attrs) {

  var Pet = {
    species: atts.species,
    name: atts.name,
    breed: attsbreed.,
    owner: atts.owner,
    neutered: atts.neutered,
    color: atts.color,
    age: atts.age
  }

  pg.connect(connectionString, function (err, client, done) {
    //query db, check if user already exists
    var userExists = this.findByEmail(User.email);
    (userExists.length > 0) ? userExists = true: userExists = false;

    //if user doesn't exist, create new user
    //create temporary password & send to user:
    var temp = password.newPassword(8);
    email.sendMessage(User.email, temp);

    User.password = this.generateHash(temp);
    temp = null;

    var result = [];

    var query = client.query('INSERT INTO pets ' +
      '(species, name, breed, owner, neutered, color, age) ' + 
      'VALUES (' +
        Pet.species + ', ' +
        Pet.name + ', ' +
        Pet.breed + ', ' +
        Pet.owner + ', ' +
        Pet.neutered + ', ' +
        Pet.color + ', ' +
        Pet.age + ');'
      );
  });

  if (err) {
    done();
    console.log(err);
    return res.status(500).json({
      success: false, 
      data: err
    });
  };

  // Stream result back one row at a time
  query.on('row', function(row) {
    result.push(row);
  });

  query.on('end', function(){
    client.end();
    console.log("Succesfully created user");
    return res.json(result);
  });

  Pet.editPet = function (attrs) {
    //TO DO
  };

  Pet.deletePet = function (id) {
    var results = [];

    pg.connect(connectionString, function (err, client, done){
      // Handle connection errors
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({ 
          success: false, data: err
        });
      };
    });

    var query = client.query('DELETE * FROM pets' + 
      'WHERE pets.id = ;' + pet_id; 
      );

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() { 
      client.end();
      return res.json(results);
    });
  }

};

module.exports = Pet;