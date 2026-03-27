const express = require('express');
const router = express.Router();
const { getPosts, createPost, likePost, commentPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id/like').put(protect, likePost);
router.route('/:id/comment').post(protect, commentPost);

module.exports = router;
