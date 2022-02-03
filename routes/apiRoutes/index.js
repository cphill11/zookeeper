const router = require('express').Router();

// add middleware so that app knows about routes into animalRoutes.js
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');

router.use(animalRoutes);
router.use(require('./zookeeperRoutes'));

module.exports = router;