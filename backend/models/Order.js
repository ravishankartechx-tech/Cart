const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  restaurantName: { type: String },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 40 },
  discount: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  total: { type: Number, required: true },
  couponCode: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveryAddress: {
    label: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
  },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentMethod: { type: String, enum: ['card', 'upi', 'cod', 'wallet'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  stripePaymentIntentId: { type: String },
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  specialInstructions: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
