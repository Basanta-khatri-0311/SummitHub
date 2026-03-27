const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, followUser, getUserById } = require('../controllers/authController');
const { getLeaderboard } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/leaderboard', getLeaderboard);
router.put('/follow/:id', protect, followUser);
router.get('/user/:id', getUserById);

// Profile is accessible with valid token (middleware placeholder if requested later)
// Currently a placeholder
// router.get('/profile', protect, getUserProfile); 

module.exports = router;
