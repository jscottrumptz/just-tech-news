// User class is an extension of this sequelize model
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// bcrypt is used for hashing the password
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
        // The .compareSync() method, which is inside the .checkPassword() method, can then 
        // confirm or deny that the supplied password matches the hashed password stored on 
        // the object. .checkPassword() will then return true on success or false on failure
    }
}

// define table columns and configuration
User.init(
    {
        // TABLE COLUMN DEFINITIONS GO HERE
        // define an id column
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true            
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {   // The nested level of the hooks object is very important. 
        // Notice that the hooks property was added to the second object in User.init().
        // if hooks are not needed, just remove 'hooks:{},'
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                // The async keyword is used as a prefix to the function that contains the asynchronous function. 
                // await can be used to prefix the async function, which will then gracefully assign the value 
                // from the response to the newUserData's password property. The newUserData is then returned 
                // to the application with the hashed password.
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                // Before we can check to see if this hook is effective however, we must add an option to the 
                // query call (user-routes.js). According to the Sequelize documentation regarding the beforeUpdate 
                // (Links to an external site.), we will need to add the option { individualHooks: true }.
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // TABLE CONFIGURATION OPTIONS GO HERE
        // (https://sequelize.org/v5/manual/models-definition.html#configuration))

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName:'user'
    }
);

module.exports = User;