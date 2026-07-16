const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// @route  POST /api/coupons/validate
// @desc   Validate a coupon code
// @access Private
router.post('/validate', authMiddleware, async (req, res) => {
  try {
    const { code, orderAmount, restaurantId } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code.' });
    if (coupon.expiryDate < new Date()) return res.status(400).json({ success: false, message: 'Coupon has expired.' });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'Coupon usage limit reached.' });
    if (orderAmount < coupon.minOrderAmount) return res.status(400).json({ success: false, message: `Min order ₹${coupon.minOrderAmount} required.` });

    const userUsed = coupon.usedBy.filter(uid => uid.toString() === req.user.id).length;
    if (userUsed >= coupon.userUsageLimit) return res.status(400).json({ success: false, message: 'You have already used this coupon.' });

    // Restaurant restriction
    if (coupon.applicableRestaurants.length > 0 && restaurantId && 
        !coupon.applicableRestaurants.map(r => r.toString()).includes(restaurantId)) {
      return res.status(400).json({ success: false, message: 'Coupon not valid for this restaurant.' });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      discount: Math.round(discount),
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/coupons
// @desc   Get all active coupons (for display)
// @access Public
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } })
      .select('-usedBy')
      .lean();
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  POST /api/coupons (Admin only)
// @desc   Create a coupon
// @access Private - admin
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'Coupon code already exists.' });
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
