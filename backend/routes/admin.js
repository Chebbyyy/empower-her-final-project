const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  getMessages,
  markMessageRead,
  getPhotos,
  setPhotoApproval,
  setUserRole,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/role', setUserRole);
router.get('/messages', getMessages);
router.patch('/messages/:id/read', markMessageRead);
router.get('/photos', getPhotos);
router.patch('/photos/:id/approval', setPhotoApproval);

module.exports = router;
