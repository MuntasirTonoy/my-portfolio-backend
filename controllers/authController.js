const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../config/emailService');

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
    res.json({ 
      message: 'Account updated successfully',
      user: {
        _id: user._id,
        email: user.email
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid current password' });
  }
};

// @desc    Request password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Sign reset token with process.env.JWT_SECRET + user.password (expires in 15m)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET + user.password,
      { expiresIn: '15m' }
    );

    // Build the reset link
    const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/admin/reset-password?token=${token}&id=${user._id}`;

    const subject = 'Password Reset Request';
    const text = `You are receiving this because you (or someone else) have requested the reset of the password for your admin account.\n\nPlease click on the following link, or paste it into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
        <h2 style="color: #02b677; text-align: center; margin-bottom: 24px;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your Portfolio Admin Panel account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background-color: #02b677; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(2,182,119,0.25);">Reset Password</a>
        </div>
        <p>This password reset link will expire in <strong>15 minutes</strong>.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br/>Portfolio Admin Team</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0 16px 0;" />
        <p style="font-size: 11px; color: #64748b; line-height: 1.6; text-align: center;">
          If you are having trouble with the button above, copy and paste this URL into your browser:<br/>
          <a href="${resetUrl}" style="color: #02b677; word-break: break-all;">${resetUrl}</a>
        </p>
      </div>
    `;

    const result = await sendEmail({ email: user.email, subject, text, html });

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error sending reset email' });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { id, token, password } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify token using JWT_SECRET + current password hash
    try {
      jwt.verify(token, process.env.JWT_SECRET + user.password);
    } catch (err) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Update password
    user.password = password;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

module.exports = { authUser, getMe, updatePassword, forgotPassword, resetPassword };
