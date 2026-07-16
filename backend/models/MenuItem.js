const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  category: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  discountedPrice: { type: Number, default: null },
  image: { type: String, default: '' },
  isVeg: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isBestSeller: { type: Boolean, default: false },
  spiceLevel: { type: String, enum: ['Mild', 'Medium', 'Hot', 'Extra Hot'], default: 'Medium' },
  preparationTime: { type: Number, default: 15 }, // in minutes
  tags: [String], // e.g. 'Must Try', 'Chef Special'
  allergens: [String],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
