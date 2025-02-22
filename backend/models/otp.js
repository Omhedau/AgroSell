const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  mobile: { type: String, unique: true, required: true },
  otp: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800, 
  },
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);
