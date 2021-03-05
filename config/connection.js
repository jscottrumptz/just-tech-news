// import the sequelize constructor from library
let Sequelize = require('sequelize');

require('dotenv').config();

    // heroku connection
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    // create connection to our database, pass in your MySQL info
    sequalize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
    });
}
module.exports = sequalize;