const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');

// call on special Sequelize functionality for /upvote
// Sequelize provides us with a special method called .literal() that allows us to run 
// regular SQL queries from within the Sequelize method-based queries.
const sequelize = require('../../config/connection');

// GET api/posts
router.get('/', (req,res) => {
    Post.findAll({
        // created_at and updated_at are auto generated unless we configure sequelize not to
        // in the Post model, we defined the column names to have an underscore naming convention by 
        // using the underscored: true, assignment. In Sequelize, columns are camelcase by default.
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],

        // use the order property to ensure that the latest news articles are shown first to the client
        // We can use the created_at column, which will display the most recently added posts first.
        order: [['created_at', 'DESC']], 

        // include the JOIN to the User table. We do this by adding the property include
        // include property is expressed as an array of objects. 
        // To define this object, we need a reference to the model and attributes
        include: [
            // include the Comment model here:
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                model: User,
                attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET api/posts/1
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
                id: req.params.id
        },
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        // test if there is a post with that id
        if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST api/posts/
router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Make sure this PUT route is defined before the /:id PUT route. 
// Otherwise, Express.js will think the word "upvote" is a valid parameter for /:id
// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {  
    // make sure the session exists first
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        // upvote is a custom static method created in models/Post.js
        Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

// PUT api/posts/1
router.put('/:id', (req,res) => {
    Post.update( {
            title: req.body.title
        },
        {
            where: {
            id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE api/posts/1
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
        id: req.params.id
        }
    })
    .then(dbPostData => {
        // see if there is a matching id
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;