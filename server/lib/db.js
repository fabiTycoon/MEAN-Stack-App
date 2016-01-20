var pg = require('pg');

var connectionString = procees.env.DATABASE_URL || 'postgres://localhost:5432/holliston_dev';

var client = new pg.Client(connectionString);