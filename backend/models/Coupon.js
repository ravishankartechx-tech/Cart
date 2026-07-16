const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: '' },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true }, // percentage or flat amount
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: null }, // max discount cap for percentage
  maxUses: { type: Number, default: null }, // null = unlimited
  usedCount: { type: Number, default: 0 },
  userUsageLimit: { type: Number, default: 1 }, // per user usage limit
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  applicableRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }], // empty = all
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
