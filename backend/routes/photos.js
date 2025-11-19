const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', photoController.getPhotos);

// Protected routes
router.post('/upload', auth, photoController.upload.single('photo'), (req, res) => {
  photoController.uploadPhoto(req, res);
});
router.get('/my-photos', auth, photoController.getUserPhotos);
router.delete('/:id', auth, photoController.deletePhoto);

module.exports = router;
