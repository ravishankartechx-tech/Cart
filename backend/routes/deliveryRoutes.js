const express = require('express');
const router = express.Router();
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// @route  POST /api/delivery/register
// @desc   Register as a delivery partner
// @access Private
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { vehicleType, vehicleNumber, licenseNumber } = req.body;

    if (!vehicleType || !vehicleNumber || !licenseNumber) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const existing = await DeliveryPartner.findOne({ user: req.user.id });
    if (existing) return res.status(409).json({ success: false, message: 'Already registered as delivery partner.' });

    const partner = await DeliveryPartner.create({
      user: req.user.id,
      vehicleType,
      vehicleNumber,
      licenseNumber,
    });

    res.status(201).json({ success: true, partner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/delivery/me
// @desc   Get delivery partner profile
// @access Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user.id })
      .populate('user', 'name email phone photoURL')
      .lean();

    if (!partner) return res.status(404).json({ success: false, message: 'Not a registered delivery partner.' });
    res.json({ success: true, partner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/delivery/status
// @desc   Toggle online/offline status
// @access Private - delivery only
router.put('/status', authMiddleware, roleMiddleware('delivery'), async (req, res) => {
  try {
    const { isOnline, isAvailable } = req.body;
    const partner = await DeliveryPartner.findOneAndUpdate(
      { user: req.user.id },
      { isOnline, isAvailable },
      { new: true }
    );
    if (!partner) return res.status(404).json({ success: false, message: 'Delivery partner not found.' });
    res.json({ success: true, partner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/delivery/location
// @desc   Update current location (called periodically)
// @access Private - delivery only
router.put('/location', authMiddleware, roleMiddleware('delivery'), async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Validate coordinates
    if (
      typeof lat !== 'number' || typeof lng !== 'number' ||
      lat < -90 || lat > 90 || lng < -180 || lng > 180
    ) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates.' });
    }

    const partner = await DeliveryPartner.findOneAndUpdate(
      { user: req.user.id },
      { currentLocation: { lat, lng, updatedAt: new Date() } },
      { new: true }
    );

    // Emit location to order room
    if (partner?.currentOrder && req.app.get('io')) {
      req.app.get('io').to(partner.currentOrder.toString()).emit('delivery_location', { lat, lng });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/delivery/orders/available
// @desc   Get orders available for pickup
// @access Private - delivery only
router.get('/orders/available', authMiddleware, roleMiddleware('delivery'), async (req, res) => {
  try {
    const orders = await Order.find({ status: 'ready', deliveryPartner: null })
      .populate('restaurant', 'name address')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/delivery/orders/:id/accept
// @desc   Accept a delivery
// @access Private - delivery only
router.put('/orders/:id/accept', authMiddleware, roleMiddleware('delivery'), async (req, res) => {
  try {
    // Check partner is registered and online
    const partner = await DeliveryPartner.findOne({ user: req.user.id });
    if (!partner) return res.status(403).json({ success: false, message: 'Not a registered delivery partner.' });
    if (!partner.isOnline) return res.status(400).json({ success: false, message: 'You must be online to accept orders.' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.deliveryPartner) return res.status(409).json({ success: false, message: 'Order already taken.' });
    if (order.status !== 'ready') return res.status(400).json({ success: false, message: 'Order is not ready for pickup.' });

    order.deliveryPartner = req.user.id;
    order.status = 'picked_up';
    await order.save();

    await DeliveryPartner.findOneAndUpdate(
      { user: req.user.id },
      { isAvailable: false, currentOrder: order._id }
    );

    if (req.app.get('io')) {
      req.app.get('io').to(order._id.toString()).emit('order_status_update', { orderId: order._id, status: 'picked_up' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/delivery/orders/:id/deliver
// @desc   Mark order as delivered
// @access Private - delivery only
router.put('/orders/:id/deliver', authMiddleware, roleMiddleware('delivery'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Only the assigned delivery partner can mark as delivered
    if (!order.deliveryPartner || order.deliveryPartner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not your order to deliver.' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ success: false, message: 'Order already delivered.' });
    }

    order.status = 'delivered';
    order.deliveredAt = new Date();
    if (order.paymentMethod !== 'cod') order.paymentStatus = 'paid';
    await order.save();

    await DeliveryPartner.findOneAndUpdate(
      { user: req.user.id },
      {
        isAvailable: true,
        currentOrder: null,
        $inc: { completedOrders: 1, totalEarnings: order.deliveryFee }
      }
    );

    if (req.app.get('io')) {
      req.app.get('io').to(order._id.toString()).emit('order_status_update', { orderId: order._id, status: 'delivered' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
