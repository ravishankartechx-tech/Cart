const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const adminOnly = [authMiddleware, roleMiddleware('admin')];

// @route  GET /api/admin/stats
// @desc   Overall platform stats
// @access Admin
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalRestaurants, totalOrders, revenueData] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Restaurant.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
      ])
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Last 7 days revenue
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyRevenue = await Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        ordersByStatus,
        dailyRevenue,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/admin/users
// @desc   Get all users
// @access Admin
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/admin/users/:id
// @desc   Update user (role, status)
// @access Admin
router.put('/users/:id', ...adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  DELETE /api/admin/users/:id
// @desc   Delete user
// @access Admin
router.delete('/users/:id', ...adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/admin/restaurants
// @desc   Get all restaurants (including pending approval)
// @access Admin
router.get('/restaurants', ...adminOnly, async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, restaurants });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/admin/restaurants/:id/approve
// @desc   Approve a restaurant
// @access Admin
router.put('/restaurants/:id/approve', ...adminOnly, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id, 
      { isApproved: req.body.isApproved !== false },
      { new: true }
    );
    res.json({ success: true, restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/admin/orders
// @desc   Get all orders
// @access Admin
router.get('/orders', ...adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
