const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' }, // Home, Work, Other
  street: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  lat: { type: Number },
  lng: { type: Number },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String },
  googleId: { type: String, index: true },
  phone: { type: String },
  photoURL: { type: String, default: '' },
  role: { 
    type: String, 
    enum: ['user', 'restaurant', 'delivery', 'admin'], 
    default: 'user' 
  },
  addresses: [addressSchema],
  isActive: { type: Boolean, default: true },
  fcmToken: { type: String }, // Firebase push token
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
