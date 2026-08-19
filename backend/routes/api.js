const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const resourcesRoutes = require('./resources');
const photoRoutes = require('./photos');
const contactRoutes = require('./contact');
const bookRoutes = require('./books');
const eventRoutes = require('./events');
const mentorshipRoutes = require('./mentorship');

router.use('/auth', authRoutes);
router.use('/resources', resourcesRoutes);
router.use('/photos', photoRoutes);
router.use('/contact', contactRoutes);
router.use('/books', bookRoutes);
router.use('/events', eventRoutes);
router.use('/mentorship', mentorshipRoutes);
router.use('/favorites', require('./favorites'));
router.use('/posts', require('./posts'));
router.use('/admin', require('./admin'));
router.use('/search', require('./search'));
router.use('/notifications', require('./notifications'));

module.exports = router;
