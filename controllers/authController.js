const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/password
// @access  Private (Admin)
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, newEmail } = req.body;
  const user = await User.findById(req.user._id);

  if (user && (await user.matchPassword(currentPassword))) {
    if (newPassword) user.password = newPassword;
    if (newEmail) user.email = newEmail;
    
    await user.save();
    res.json({ message: 'Account updated successfully' });
  } else {
    res.status(401).json({ message: 'Invalid current password' });
  }
};

module.exports = { authUser, getMe, updatePassword };
