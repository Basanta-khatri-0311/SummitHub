const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get top users by points/activity
// @route   GET /api/auth/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    // Dynamically calculate some "activity" if points are 0 for everyone
    // But let's just sort by the points field for now
    const users = await User.find()
      .select('name avatar points achievements')
      .sort({ points: -1 })
      .limit(10);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user points (Internal helper or called during post)
// @access  Private
const awardPoints = async (userId, pointsToAdd) => {
    try {
        await User.findByIdAndUpdate(userId, { $inc: { points: pointsToAdd } });
    } catch (err) {
        console.error("Failed to award points", err);
    }
};

module.exports = {
  getLeaderboard,
  awardPoints
};
