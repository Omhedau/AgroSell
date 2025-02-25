const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  lang: { type: String, default: "English" }, // Language setting

  storeDetails: {
    storeName: { type: String, required: false }, 
    storeLogo: { type: String, default: "default-logo.png" },
    description: { type: String, default: "" }, 
    gstNumber: { type: String, default: null }, 
    businessLicense: { type: String, default: null },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
  },

  storeAddress: {
    street: { type: String, required: false },
    district: { type: String, required: false },
    taluka: { type: String, required: false },
    village: { type: String, required: false },
    pincode: { type: String, required: false },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },

  bankDetails: {
    accountHolderName: { type: String, required: false },
    bankName: { type: String, required: false },
    accountNumber: { type: String, required: false },
    ifscCode: { type: String, required: false },
    upiId: { type: String, default: null },
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
