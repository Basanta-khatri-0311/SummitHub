const express = require('express');
const router = express.Router();
const { getPosts, createPost, likePost, commentPost, getMyPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.get('/my-posts', protect, getMyPosts);
router.route('/:id/like').put(protect, likePost);
router.route('/:id/comment').post(protect, commentPost);

module.exports = router;
