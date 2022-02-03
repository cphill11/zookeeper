const router = require('express').Router();

// add middleware so that app knows about routes into animalRoutes.js
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(animalRoutes);

module.exports = router;