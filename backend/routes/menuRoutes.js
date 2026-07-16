const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// @route  GET /api/menu/:restaurantId
// @desc   Get all menu items for a restaurant
// @access Public
router.get('/:restaurantId', async (req, res) => {
  try {
    const items = await MenuItem.find({ 
      restaurant: req.params.restaurantId, 
      isAvailable: true 
    }).lean();
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  POST /api/menu
// @desc   Add a menu item
// @access Private - restaurant/admin
router.post('/', authMiddleware, roleMiddleware('restaurant', 'admin'), async (req, res) => {
  try {
    const { restaurantId, category, name, description, price, image, isVeg, spiceLevel, tags } = req.body;

    // Check ownership
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const item = await MenuItem.create({
      restaurant: restaurantId,
      category,
      name,
      description,
      price,
      image,
      isVeg,
      spiceLevel,
      tags,
    });

    res.status(201).json({ success: true, item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/menu/:id
// @desc   Update a menu item
// @access Private
router.put('/:id', authMiddleware, roleMiddleware('restaurant', 'admin'), async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  DELETE /api/menu/:id
// @desc   Delete a menu item
// @access Private
router.delete('/:id', authMiddleware, roleMiddleware('restaurant', 'admin'), async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Menu item deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
