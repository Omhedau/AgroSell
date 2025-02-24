const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // For authentication
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  profilePicture: { type: String, default: "default-profile.png" },
  storeDetails: {
    storeName: { type: String, required: true },
    storeLogo: { type: String, default: "default-logo.png" },
    description: { type: String, default: "" }, // Optional store bio
    gstNumber: { type: String, default: null }, // Business GSTIN
    businessLicense: { type: String, default: null }, // License details
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
  },
  storeAddress: {
    street: { type: String, required: true },
    district: { type: String, required: true },
    taluka: { type: String, required: true },
    village: { type: String, required: true },
    pincode: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  bankDetails: {
    accountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    upiId: { type: String, default: null }, // Optional for UPI payments
  },
  salesStatistics: {
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Seller", SellerSchema);
