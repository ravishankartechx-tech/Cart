const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authLimiter } = require('../middleware/rateLimiter');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '7d' }
  );
};

// @route  POST /api/auth/register
// @desc   Register a new user
// @access Public
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const allowedRoles = ['user', 'restaurant', 'delivery', 'admin'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      role: userRole,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, photoURL: user.photoURL },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  POST /api/auth/login
// @desc   Login user
// @access Public
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Please login with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, photoURL: user.photoURL, phone: user.phone },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/auth/me
// @desc   Get current user profile
// @access Private
const authMiddleware = require('../middleware/auth');
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/auth/profile
// @desc   Update user profile
// @access Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, photoURL, addresses } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (photoURL) updates.photoURL = photoURL;
    if (addresses) updates.addresses = addresses;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  POST /api/auth/google
// @desc   Google OAuth — verify ID token, create or login user
// @access Public
router.post('/google', authLimiter, async (req, res) => {
  try {
    const { name, email, googleId, photoURL } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ success: false, message: 'Google auth data incomplete.' });
    }

    let user = await User.findOne({ email });

    if (user) {
      // Update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.photoURL = photoURL || user.photoURL;
        await user.save();
      }
    } else {
      // Create new user from Google
      user = await User.create({ name, email, googleId, photoURL, role: 'user' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, photoURL: user.photoURL },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
