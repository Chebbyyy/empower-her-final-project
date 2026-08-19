const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, addComment } = require('../controllers/postsController');
const { protect } = require('../middleware/auth');

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', protect, createPost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
