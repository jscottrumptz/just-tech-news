const router = require('express').Router();
const { Post, User } = require('../../models');

// GET api/posts
router.get('/', (req,res) => {
    Post.findAll({
        // created_at and updated_at are auto generated unless we configure sequelize not to
        // in the Post model, we defined the column names to have an underscore naming convention by 
        // using the underscored: true, assignment. In Sequelize, columns are camelcase by default.
        attributes: ['id', 'post_url', 'title', 'created_at'],

        // use the order property to ensure that the latest news articles are shown first to the client
        // We can use the created_at column, which will display the most recently added posts first.
        order: [['created_at', 'DESC']], 

        // include the JOIN to the User table. We do this by adding the property include
        // include property is expressed as an array of objects. 
        // To define this object, we need a reference to the model and attributes
        include: [
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
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
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