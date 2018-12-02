var pgp = require('pg-promise')();

/*below code is for running server on local machine*/
/*
const dbConfig = {
   host: 'localhost',
   port: 5432,
   database: 'finalproject',
   user: 'postgres',
   password: 'postgres' // TODO: Fill in your PostgreSQL password here.
                // Use empty string if you did not set a password
};
*/

/*below code is for running server in cloud*/
var dbConfig = process.env.DATABASE_URL;

var db = pgp(dbConfig);

module.exports = db;
