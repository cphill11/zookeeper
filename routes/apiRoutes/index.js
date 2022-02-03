const router = require('express').Router();

// add middleware so that app knows about routes into animalRoutes.js
const animalRoutes = require('./animalRoutes');

router.use(animalRoutes);

module.exports = router;