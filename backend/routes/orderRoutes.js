const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// @route  POST /api/orders
// @desc   Place a new order
// @access Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { restaurantId, restaurantName, items, deliveryAddress, paymentMethod, couponCode, specialInstructions, discount: reqDiscount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item.' });
    }

    const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
    const deliveryFee = subtotal > 0 ? (req.body.deliveryFee !== undefined ? Number(req.body.deliveryFee) : 40) : 0;
    const discount = Number(reqDiscount) || 0;
    const taxes = Math.round(subtotal * 0.05);
    const total = Math.max(0, subtotal + deliveryFee + taxes - discount);

    const estimatedDelivery = new Date(Date.now() + 35 * 60 * 1000); // 35 mins from now

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      restaurantName,
      items,
      subtotal,
      deliveryFee,
      discount,
      taxes,
      total,
      couponCode,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      estimatedDelivery,
      specialInstructions,
    });

    // Emit socket event for real-time tracking
    if (req.app.get('io')) {
      req.app.get('io').to(`restaurant_${restaurantId}`).emit('new_order', { orderId: order._id, restaurantId });
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/orders/history
// @desc   Get user's order history
// @access Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('restaurant', 'name coverImage')
      .lean();
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/orders/:id
// @desc   Get single order details
// @access Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name coverImage address')
      .populate('deliveryPartner', 'name phone photoURL')
      .lean();

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'restaurant') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/orders/:id/status
// @desc   Update order status
// @access Private - restaurant/delivery/admin
router.put('/:id/status', authMiddleware, roleMiddleware('restaurant', 'delivery', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();

    // Emit real-time update
    if (req.app.get('io')) {
      req.app.get('io').to(req.params.id).emit('order_status_update', { orderId: req.params.id, status });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/orders/restaurant/:restaurantId
// @desc   Get all orders for a restaurant
// @access Private - restaurant/admin
router.get('/restaurant/:restaurantId', authMiddleware, roleMiddleware('restaurant', 'admin'), async (req, res) => {
  try {
    const filter = mongoose.Types.ObjectId.isValid(req.params.restaurantId)
      ? { restaurant: req.params.restaurantId }
      : { restaurantName: { $regex: req.params.restaurantId, $options: 'i' } };

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name phone')
      .lean();
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/orders/:id/rate
// @desc   Rate a delivered order
// @access Private
router.put('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized.' });
    if (order.status !== 'delivered') return res.status(400).json({ success: false, message: 'Can only rate delivered orders.' });

    order.rating = rating;
    order.review = review;
    await order.save();

    res.json({ success: true, message: 'Review submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;