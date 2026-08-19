const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const { protect } = require('../middleware/auth');

router.get('/', photoController.getPhotos);
router.post('/upload', protect, photoController.upload.single('photo'), photoController.uploadPhoto);
router.get('/my-photos', protect, photoController.getUserPhotos);
router.delete('/:id', protect, photoController.deletePhoto);

module.exports = router;
