// import models
const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment')
// create associations

// ONE TO MANY //

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

// MANY TO MANY //

// With these two .belongsToMany() methods in place, we're allowing both the User and 
// Post models to query each other's information in the context of a vote. If we want to 
// see which users voted on a single post, we can now do that. If we want to see which 
// posts a single user voted on, we can see that too. 

// We instruct the application that the User and Post models will be connected, but in 
// this case through the Vote model. We state what we want the foreign key to be in Vote, 
// which aligns with the fields we set up in the model. We also stipulate that the name of 
// the Vote model should be displayed as voted_posts when queried on, making it a little 
// more informative

User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});
  
  Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});


// more associations

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});
  
User.hasMany(Vote, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    // so you can delete posts with comments on them
    onDelete: 'cascade'
});
  
User.hasMany(Comment, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };