const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { getLeaderboard } = require('../controllers/leaderboardController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/leaderboard', getLeaderboard);

// Profile is accessible with valid token (middleware placeholder if requested later)
// Currently a placeholder
// router.get('/profile', protect, getUserProfile); 

module.exports = router;
