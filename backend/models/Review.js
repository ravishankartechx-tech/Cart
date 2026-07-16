const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  foodRating: { type: Number, min: 1, max: 5 },
  deliveryRating: { type: Number, min: 1, max: 5 },
  comment: { type: String, trim: true },
  images: [String],
  likes: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false }, // verified purchase
}, { timestamps: true });

// Each user can only review a restaurant once per order
reviewSchema.index({ user: 1, restaurant: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
