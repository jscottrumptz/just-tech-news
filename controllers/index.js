const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);

// any request to any endpoint that doesn't exist, will receive 
// a 404 error indicating we have requested an incorrect resource.
// the code below is commented out because it breaks the express middleware function in server.js
// router.use((req, res) => {
//   res.status(404).end();
// });

module.exports = router;