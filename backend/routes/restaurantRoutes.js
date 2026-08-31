const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// @route  GET /api/restaurants
// @desc   Get all approved restaurants (with filters + pagination)
// @access Public
router.get('/', async (req, res) => {
  try {
    const { search, cuisine, rating, veg, sort, page = 1, limit = 20 } = req.query;

    let query = { isApproved: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisines: { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine) {
      query.cuisines = { $regex: cuisine, $options: 'i' };
    }

    if (rating) {
      const parsedRating = parseFloat(rating);
      if (!isNaN(parsedRating)) {
        query.rating = { $gte: parsedRating };
      }
    }

    if (veg === 'true') {
      query.isPureVeg = true;
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'rating') sortQuery = { rating: -1 };
    if (sort === 'delivery') sortQuery = { deliveryTime: 1 };
    if (sort === 'cost_low') sortQuery = { costForTwo: 1 };
    if (sort === 'cost_high') sortQuery = { costForTwo: -1 };

    const restaurants = await Restaurant.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Restaurant.countDocuments(query);
    res.json({ success: true, restaurants, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/restaurants/owner/mine
// @desc   Get restaurants owned by logged-in user
// @access Private
// ⚠️ This MUST be before /:id route to avoid being caught by it
router.get('/owner/mine', authMiddleware, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user.id });
    res.json({ success: true, restaurants });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/restaurants/:id
// @desc   Get single restaurant with menu
// @access Public
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID.' });
    }

    const restaurant = await Restaurant.findById(req.params.id).lean();
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    const menuItems = await MenuItem.find({ restaurant: restaurant._id, isAvailable: true }).lean();

    // Group by category
    const menuByCategory = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    const menu = Object.keys(menuByCategory).map(category => ({
      category,
      items: menuByCategory[category],
    }));

    res.json({ success: true, restaurant, menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  POST /api/restaurants
// @desc   Create a restaurant
// @access Private - restaurant/admin role
router.post('/', authMiddleware, roleMiddleware('restaurant', 'admin'), async (req, res) => {
  try {
    const {
      name,
      description,
      cuisines,
      address,
      coverImage,
      deliveryTime,
      costForTwo,
      deliveryFee,
      isPureVeg
    } = req.body;

    if (!name || !address) {
      return res.status(400).json({ success: false, message: 'Name and address are required.' });
    }

    // One restaurant per owner
    const existing = await Restaurant.findOne({ owner: req.user.id });
    if (existing && req.user.role !== 'admin') {
      return res.status(409).json({ success: false, message: 'You already have a registered restaurant.' });
    }

    const restaurant = await Restaurant.create({
      owner: req.user.id,
      name,
      description,
      cuisines: Array.isArray(cuisines) ? cuisines : [cuisines],
      address,
      coverImage,
      deliveryTime,
      costForTwo,
      deliveryFee,
      isPureVeg,
      isApproved: false,
    });

    res.status(201).json({ success: true, restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  PUT /api/restaurants/:id
// @desc   Update restaurant details
// @access Private - owner or admin
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID.' });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    // Whitelist updatable fields — prevent owner/isApproved tampering
    const {
      name,
      description,
      cuisines,
      address,
      coverImage,
      images,
      deliveryTime,
      costForTwo,
      deliveryFee,
      isPureVeg,
      isOpen,
      openingTime,
      closingTime,
      tags,
      minOrder,
    } = req.body;

    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        cuisines,
        address,
        coverImage,
        images,
        deliveryTime,
        costForTwo,
        deliveryFee,
        isPureVeg,
        isOpen,
        openingTime,
        closingTime,
        tags,
        minOrder,
      },
      { new: true }
    );

    res.json({ success: true, restaurant: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  DELETE /api/restaurants/:id
// @desc   Delete restaurant and its menu
// @access Private - owner or admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID.' });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Not found.' });

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await restaurant.deleteOne();
    await MenuItem.deleteMany({ restaurant: req.params.id });

    res.json({ success: true, message: 'Restaurant and its menu deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;