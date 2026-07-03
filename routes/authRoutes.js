const express = require('express');
const router = express.Router();
const { authUser, getMe, updatePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/debug-user', async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
