const express = require('express');
const router = express.Router();
const { getResources, addResource } = require('../controllers/resourcesController');
const { protect } = require('../middleware/auth');

router.get('/', getResources);
router.post('/', protect, addResource);

module.exports = router;
