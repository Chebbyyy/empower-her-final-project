const express = require('express');
const router = express.Router();
const { getResources, addResource } = require('../controllers/resourcesController');

router.get('/', getResources);
router.post('/', addResource);

module.exports = router;
