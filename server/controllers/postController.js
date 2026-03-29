const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { location, content, difficulty, imageUrl, coordinates, gpxData } = req.body;
    const { awardPoints } = require('./leaderboardController');

    const post = new Post({
      user: req.user._id,
      location,
      coordinates,
      gpxData,
      content,
      difficulty,
      imageUrl,
    });

    const createdPost = await post.save();
    
    // Auto-award 50 points for an expedition log
    await awardPoints(req.user._id, 50);

    const populatedPost = await createdPost.populate('user', 'name avatar');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post is already liked by this user
    const hasLiked = post.likes.some(id => id.toString() === req.user._id.toString());
    if (hasLiked) {
      post.likes = post.likes.filter((userId) => userId.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json(post.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/posts/:id/comment
// @access  Private
const commentPost = async (req, res) => {
  try {
    const { comment, parentId } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: req.user._id,
      name: req.user.name,
      comment,
      parentId: parentId || null
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user posts
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the owner
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this transmission.' });
    }

    await post.deleteOne();
    res.json({ message: 'Transmission terminated from global feed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  createPost,
  likePost,
  commentPost,
  getMyPosts,
  deletePost
};
