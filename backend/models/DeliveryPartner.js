const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  vehicleType: { type: String, enum: ['bike', 'scooter', 'bicycle', 'car'], default: 'bike' },
  vehicleNumber: { type: String },
  licenseNumber: { type: String },
  isApproved: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date },
  },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  completedOrders: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  documents: {
    idProof: String,
    licenseImage: String,
    vehicleRC: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
