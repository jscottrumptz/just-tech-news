// import models
const User = require('./User')
const Post = require('./Post');

// create associations

// This association creates the reference for the id column in the User model to link to the 
// corresponding foreign key pair, which is the user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// In this statement, we are defining the relationship of the Post model to the User. 
// The constraint we impose here is that a post can belong to one user, but not many users. 
// Again, we declare the link to the foreign key, which is designated at user_id in the Post model.
Post.belongsTo(User, {
    foreignKey: 'user_id',

    // onDelete: 'cascade'
    // delete all posts by user if user is deleted
})



module.exports = { User, Post };