const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // access our User model and run .findAll() method
    // similar to SQL query 'SELECT * FROM users;'
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
        }
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