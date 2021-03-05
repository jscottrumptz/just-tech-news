const router = require('express').Router();
const { User, Post, Vote } = require("../../models");

// GET /api/users
router.get('/', (req, res) => {
    // access our User model and run .findAll() method
    // similar to SQL query 'SELECT * FROM users;' users
    // select all users from the user table in the database
    User.findAll({
        // exclude a field when getting data
        attributes: { exclude: ['password'] }
        })
        // and send it back as JSON
        .then(dbUserData => res.json(dbUserData))
        // if there is an err catch it and send a response
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    // access our User model and run .findOne() method
    // similar to SQL query 'SELECT * FROM users WHERE id = 1;'
    // only returns one user based on its req.params.id value
    User.findOne({
        // exclude a field when getting data
        attributes: { exclude: ['password'] },
        // define required param
        where: {
            id: req.params.id
        },

        // When we query a single user, we'll receive the title information of every post they've ever 
        // voted on. Notice how we had to make this happen, though. We had to include the Post model, 
        // as we did before; but this time we had to contextualize it by going through the Vote table.
        include: [
            {
                // will come under the property name posts
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
            // Now when we query a user, we can see which posts a user has created and which posts a user 
            // has voted on, which will come under the property name voted_posts
        ]
    })
    // send a reply back as JSON
    .then(dbUserData => {
        // see if a user matched the id
        if (!dbUserData) {
            // if not, send a respone
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        // if so, send the user data
        res.json(dbUserData);
    })
    // if there is an err catch it and send a response
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    // access our User model and run .create() method
    // similar to SQL query 'INSERT INTO users
    //                       (username, email, password)
    //                       VALUES
    //                       ("Lernantino", "lernantino@gmail.com", "password1234");'
    // create a new user and add them to the user table in the database
    User.create({
        // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    // insert the new user into the db and send it back as a json
    .then(dbUserData => res.json(dbUserData))
    // if there is an err catch it and send a response
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// POST /api/login
router.post('/login', (req, res) => {
    // Query operation
    // A GET method carries the request parameter appended in the URL string, whereas a POST 
    // method carries the request parameter in req.body, which makes it a more secure way of 
    // transferring data from the client to the server. Remember, the password is still in 
    // plaintext, which makes this transmission process a vulnerable link in the chain.

    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then (dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'No user found with this email address'});
            return;
        }
        // Here's what we're doing in the preceding code. We queried the User table using the findOne() 
        // method for the email entered by the user and assigned it to req.body.email. If the user with 
        // that email was not found, a message is sent back as a response to the client. However, if the 
        // email was found in the database, the next step will be to verify the user's identity by 
        // matching the password from the user and the hashed password in the database. This will be 
        // done in the Promise of the query.

        // verify user password using a method within our User class
        const validPassword = dbUserData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect Password!' });
            return;
        }
        res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // access our User model and run .update() method
    // similar to SQL query 'UPDATE users
    //                       SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
    //                       WHERE id = 1;'
    // update a current user in the database
    User.update(req.body, {
        // option set to true to enable bcrypt hashing of passwords
        individualHooks: true,
        // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
        // We pass in req.body to provide the new data we want to use in the update 
        // and req.params.id to indicate where exactly we want that new data to be used.
        // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
        where: {
            id:req.params.id
        }
    })
    // send a reply back as JSON
    .then(dbUserData => {
        // see if a user matched the id
        if (!dbUserData[0]) {
            // if not, send a respone
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        // if so, update and send the data
        res.json(dbUserData);
    })
    // if there is an err catch it and send a response
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    // access our User model and run .destroy() method
    // similar to SQL query 'SELECT * FROM users WHERE id = 1;'
    // removes a user from the database based on its req.params.id value
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    // send a reply back as JSON
    .then(dbUserData => {
        // see if a user matched the id
        if(!dbUserData) {
            // if not, send a respone
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        // if so, send the data
        res.json(dbUserData);
    })
    // if there is an err catch it and send a response
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

module.exports = router;