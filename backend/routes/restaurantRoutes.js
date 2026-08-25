const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// @route  GET /api/restaurants
// @desc   Get all approved restaurants (with filters)
// @access Public
router.get('/', async (req, res) => {
  try {
    const { search, cuisine, rating, veg, sort } = req.query;

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
      query.rating = { $gte: parseFloat(rating) };
    }

    if (veg === 'true') {
      query.isPureVeg = true;
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'rating') sortQuery = { rating: -1 };
    if (sort === 'delivery') sortQuery = { deliveryTime: 1 };
    if (sort === 'cost_low') sortQuery = { costForTwo: 1 };
    if (sort === 'cost_high') sortQuery = { costForTwo: -1 };

    const restaurants = await Restaurant.find(query).sort(sortQuery).lean();
    res.json({ success: true, restaurants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/restaurants/:id
// @desc   Get single restaurant
// @access Public
router.get('/:id', async (req, res) => {
  try {
    let restaurant = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      restaurant = await Restaurant.findById(req.params.id).lean();
    }
    if (!restaurant) {
      restaurant = await Restaurant.findOne({ name: { $regex: req.params.id, $options: 'i' } }).lean();
    }
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
// @desc   Create a restaurant (restaurant owner)
// @access Private - restaurant role
router.post('/', authMiddleware, roleMiddleware('restaurant', 'admin'), async (req, res) => {
  try {
    const { name, description, cuisines, address, coverImage, deliveryTime, costForTwo, deliveryFee, isPureVeg } = req.body;

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
      isApproved: false, // Needs admin approval
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
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, restaurant: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  DELETE /api/restaurants/:id
// @desc   Delete restaurant
// @access Private - owner or admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Not found.' });

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await Restaurant.findByIdAndDelete(req.params.id);
    await MenuItem.deleteMany({ restaurant: req.params.id });

    res.json({ success: true, message: 'Restaurant and its menu deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  GET /api/restaurants/owner/mine
// @desc   Get restaurants owned by the logged-in user
// @access Private
router.get('/owner/mine', authMiddleware, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user.id });
    res.json({ success: true, restaurants });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
