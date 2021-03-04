// import the sequelize constructor from library
const Sequelize = require('sequelize');

require('dotenv').config();

// create connection to our database, pass in your MySQL info
const sequalize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequalize;