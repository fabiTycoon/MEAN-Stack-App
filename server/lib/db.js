var pg = require('pg');
var bPromise = require('bluebird');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/holliston_dev';
var client = new pg.Client(connectionString);


//SCHEMA FUNCTIONS:
var Schema = {};

Schema.createAllTables = function () {
  this.createUsersTable()
  this.createPetsTable();
  this.createReservationsTable();
}

Schema.createUsersTable = function () {
  client.connect();

  var query = client.query('CREATE TABLE IF NOT EXISTS "Users" ( ' +
    '"id" bigint NOT NULL UNIQUE, ' +
    '"first" char NOT NULL, ' +
    '"last" char NOT NULL, ' +
    '"email" character varying NOT NULL, ' +
    '"phone" int NOT NULL, ' +
    '"street" character varying NOT NULL, ' +
    '"city" character NOT NULL, ' +
    '"state" character NOT NULL, ' +
    '"zip" int NOT NULL, ' +
    '"hospital" character NOT NULL, ' +
    'CONSTRAINT Users_pk PRIMARY KEY ("id") ) WITH (OIDS=FALSE)'
  );

  query.on('end', function() { 
    console.log("Created users table");
    client.end();
  });
};

Schema.createPetsTable = function () {
  client.connect();

  var query = client.query('CREATE TABLE IF NOT EXISTS "Pets" ( ' +
    '"id" bigint NOT NULL,' +
    '"name" char NOT NULL,' +
    '"breed" char,' +
    '"weight" int4 NOT NULL,' +
    '"color" char,' +
    '"age" int2,' +
    '"neutered" bool NOT NULL,' +
    '"owner" bigint NOT NULL,' +
    '"reservations" bigint NOT NULL,' +
    '"foodBrand" character varying,' +
    '"foodServings" bigint,' +
    '"foodAllergies" character varying,' +
    '"comments" character varying,' +
    'CONSTRAINT Pets_pk PRIMARY KEY ("id")) WITH (OIDS=FALSE)' + 
    'ALTER TABLE "Pets" ADD CONSTRAINT "Pets_fk0"' +
    'FOREIGN KEY (owner) REFERENCES Users(id);' +
    'ALTER TABLE "Pets" ADD CONSTRAINT "Pets_fk1"' +
    'FOREIGN KEY (reservations) REFERENCES Reservations(id);'
  );
  query.on('end', function() { 
    console.log("Created pets table");
    client.end();
  });
}

Schema.createReservationsTable = function () {
  client.connect();

  var query = client.query('CREATE TABLE IF NOT EXISTS "Resevations" ( ' +
      '"id" bigint NOT NULL,'+
      '"service" char NOT NULL,'+
      '"checkIn" DATE NOT NULL,'+
      '"checkOut" DATE NOT NULL,'+
      '"checkInTime" TIME NOT NULL,'+
      '"checkOutTime" TIME NOT NULL,'+
      '"owner" bigint NOT NULL,'+
      'CONSTRAINT Reservations_pk PRIMARY KEY ("id")) WITH (OIDS=FALSE' +
      'ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_fk0"' +
      'FOREIGN KEY (owner) REFERENCES Users(id);'
  );
  query.on('end', function() { 
    console.log("Created reservations table");
    client.end();
  });
}

module.exports = Schema;