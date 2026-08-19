const express = require('express');
const router = express.Router();
const { getBooks, getBook, addBook } = require('../controllers/booksController');
const { protect } = require('../middleware/auth');

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', protect, addBook);

module.exports = router;
