const express = require('express');
const router = express.Router();
const {
  getProfiles,
  getMyProfile,
  upsertProfile,
  sendRequest,
  getMyRequests,
  respondToRequest,
} = require('../controllers/mentorshipController');
const { protect } = require('../middleware/auth');

router.get('/profiles', getProfiles);
router.get('/me', protect, getMyProfile);
router.put('/me', protect, upsertProfile);
router.get('/requests', protect, getMyRequests);
router.post('/requests', protect, sendRequest);
router.patch('/requests/:id', protect, respondToRequest);

module.exports = router;
