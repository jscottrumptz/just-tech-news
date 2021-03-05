// Model and Datatypes from the sequelize package
const { Model, DataTypes } = require('sequelize');
// the connection to MySQL
const sequelize = require('../config/connection');

// create the post model
class Post extends Model {}

// create feilds/columns for the Post model
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            // Using the references property, we establish the relationship between this post and the user 
            // by creating a reference to the User model, specifically to the id column that is defined by 
            // the key property, which is the primary key. The user_id is conversely defined as the foreign 
            // key and will be the matching link.
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        // do not pluralize the table name set it equal to the model name
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // assign our model name (keep lowercase)
        modelName: 'post'
    }
);

module.exports = Post;