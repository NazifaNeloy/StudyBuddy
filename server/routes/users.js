const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   POST /users/:id/onboarding
// @desc    Complete user onboarding and save skills
router.post('/:id/onboarding', authMiddleware, async (req, res) => {
  try {
    // Ensure the user updating the profile is the authenticated user
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Unauthorized mapping' });
    }

    const { possessedSkills, skillsToLearn } = req.body;
    
    const updatedUser = await User.completeOnboarding(req.user.id, possessedSkills, skillsToLearn);
    
    res.json({ message: 'Onboarding completed successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during onboarding' });
  }
});

// @route   GET /users/:id/matches
// @desc    Get recommended study partners based on skills
router.get('/:id/matches', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const matches = await User.findMatches(req.user.id);
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching matches' });
  }
});

module.exports = router;
