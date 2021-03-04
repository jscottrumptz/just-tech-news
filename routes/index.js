const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// any request to any endpoint that doesn't exist, will receive 
// a 404 error indicating we have requested an incorrect resource.
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;