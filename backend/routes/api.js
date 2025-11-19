const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const resourcesRoutes = require('./resources');

// Mount routes
router.use('/auth', authRoutes);
router.use('/resources', resourcesRoutes);

// Add more routes here as needed
// router.use('/users', userRoutes);
// router.use('/events', eventRoutes);

module.exports = router;
