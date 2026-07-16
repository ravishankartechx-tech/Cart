const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  cuisines: [String],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  deliveryTime: { type: String, default: '30-40 mins' },
  minOrder: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  costForTwo: { type: Number, default: 400 },
  images: [String],
  coverImage: { type: String, default: '' },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
  },
  isApproved: { type: Boolean, default: false },
  isOpen: { type: Boolean, default: true },
  isPureVeg: { type: Boolean, default: false },
  tags: [String], // e.g. 'Trending', 'Top Rated', 'New'
  openingTime: { type: String, default: '09:00' },
  closingTime: { type: String, default: '23:00' },
}, { timestamps: true });

restaurantSchema.index({ name: 'text', cuisines: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
