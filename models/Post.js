// Model and Datatypes from the sequelize package
const { Model, DataTypes } = require('sequelize');
// the connection to MySQL
const sequelize = require('../config/connection');

// create the post model
class Post extends Model {
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            // then find the post we just voted on
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                    // Under some circumstances, built-in Sequelize methods can do just that—specifically 
                    // one called .findAndCountAll(). Unfortunately, because we're counting an associated 
                    // table's data and not the post itself, that method won't work here.
                ]
            });
        });
    }
}

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