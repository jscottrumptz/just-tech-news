const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// Note we're importing the connection to Sequelize from config/connection.js.
// Then, at the bottom of the file, we use the sequelize.sync() method to establish the 
// connection to the database. The "sync" part means that this is Sequelize taking the 
// models and connecting them to associated database tables. If it doesn't find a table, 
// it'll create it for you!

// turn on connection to db and server
sequelize.sync({ force:false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on ${PORT}`));
});

//The other thing to notice is the use of {force: false} in the .sync() method. 
// This doesn't have to be included, but if it were set to true, it would drop and 
// re-create all of the database tables on startup. This is great for when we make 
// changes to the Sequelize models, as the database would need a way to understand 
// that something has changed.