const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  addEvent,
  rsvpEvent,
  cancelRsvp,
} = require('../controllers/eventsController');
const { protect } = require('../middleware/auth');

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, addEvent);
router.post('/:id/rsvp', protect, rsvpEvent);
router.delete('/:id/rsvp', protect, cancelRsvp);

module.exports = router;
