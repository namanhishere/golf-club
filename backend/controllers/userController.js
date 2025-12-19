const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    // Frontend Profile.jsx: const endpoint = userId ? `/profile?userId=${userId}` : '/profile';
    const targetId = req.query.userId || req.user.id;
    
    const profile = await User.getProfile(targetId);
    if (!profile) return res.status(404).json({ error: 'User not found' });
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.updateProfile(req.user.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDirectory = async (req, res) => {
  try {
    const users = await User.getDirectory();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};