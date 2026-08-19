const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require('../controllers/favoritesController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.get('/:itemType/:itemId', checkFavorite);
router.delete('/:itemType/:itemId', removeFavorite);

module.exports = router;
