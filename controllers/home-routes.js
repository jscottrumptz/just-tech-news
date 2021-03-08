const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    // to console-log the session variables
    console.log("TESTING" + req.session);

    Post.findAll({
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
        // This will loop over and map each Sequelize object into a serialized version of itself, 
        // saving the results in a new posts array. Now we can plug that array into the template
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // The data that Sequelize returns is actually a Sequelize object with a lot more information 
        // attached to it than you might have been expecting. To serialize the object down to only the 
        // properties you need, you can use Sequelize's get() method.

        // Previously, we used res.send() or res.sendFile() for the response. 
        // Because we've hooked up a template engine, we can now use res.render() 
        // and specify which template we want to use. In this case, we want to render 
        // the homepage.handlebars template (the .handlebars extension is implied).
        res.render('homepage', { posts });
        // even though the render() method can accept an array instead of an object, 
        // that would prevent us from adding other properties to the template later on. 
        // To avoid future headaches, we can simply add the array to an object and continue 
        // passing an object to the template.
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    console.log("TESTING" + req.session);
    // redirect to homepage if login session exists
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});


module.exports = router;