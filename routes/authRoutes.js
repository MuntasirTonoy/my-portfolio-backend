const express = require('express');
const router = express.Router();
const { authUser, getMe, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

module.exports = router;
