const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/auth');

// @route  GET /api/reviews/:restaurantId
// @desc   Get all reviews for a restaurant
// @access Public
router.get('/:restaurantId', async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name photoURL')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route  POST /api/reviews
// @desc   Post a review
// @access Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { restaurantId, orderId, rating, foodRating, deliveryRating, comment } = req.body;

    const review = await Review.create({
      user: req.user.id,
      restaurant: restaurantId,
      order: orderId,
      rating,
      foodRating,
      deliveryRating,
      comment,
      isVerified: !!orderId,
    });

    // Update restaurant's average rating
    const allReviews = await Review.find({ restaurant: restaurantId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: Math.round(avgRating * 10) / 10,
      totalRatings: allReviews.length,
    });

    const populated = await review.populate('user', 'name photoURL');
    res.status(201).json({ success: true, review: populated });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You already reviewed this order.' });
    }
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
