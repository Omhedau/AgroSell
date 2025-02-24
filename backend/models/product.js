const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  }, // Linked to Seller
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "Seeds",
      "Pesticides",
      "Fertilizers",
      "Herbicides",
      "Crops",
      "Tools & Equipment",
    ],
    required: true,
  },
  subCategory: { type: String, required: false }, // e.g., "Wheat Seeds", "Organic Fertilizer"
  brand: { type: String, required: false }, // Optional for local products
  images: [{ type: String, required: true }], // Array of image URLs

  // ✅ *Pricing*
  price: {
    mrp: { type: Number, required: true }, // Maximum Retail Price
    sellingPrice: { type: Number, required: true }, // Final selling price
    discountPercentage: { type: Number, default: 0 }, // ((MRP - SellingPrice) / MRP) * 100
  },

  // ✅ *Inventory*
  stock: {
    quantity: { type: Number, required: true }, // Available stock
    lowStockThreshold: { type: Number, default: 5 }, // Alert when stock is low
  },

  // ✅ *Agricultural-Specific Specifications*
  specifications: {
    weight: { type: String, default: null }, // e.g., "50kg", "1L"
    composition: { type: String, default: null }, // e.g., "NPK 20-20-20", "Glyphosate 41%"
    usageInstructions: { type: String, default: null }, // How to use the product
    expiryDate: { type: Date, default: null }, // Only for pesticides, fertilizers
    cropSuitability: [{ type: String }], // e.g., ["Wheat", "Rice", "Maize"]
    soilType: [{ type: String }], // e.g., ["Sandy", "Clay", "Loamy"]
    organic: { type: Boolean, default: false }, // True if the product is organic
  },

  // ✅ *Variants (For Seeds, Fertilizers, etc.)*
  variants: [
    {
      variantName: { type: String }, // "Weight", "Packaging Size"
      options: [{ name: String, additionalPrice: Number }], // e.g., ["1kg", "5kg", "10kg"]
    },
  ],

  // ✅ *Search Optimization*
  tags: [{ type: String, index: true }], // Keywords for easy search (e.g., ["wheat seeds", "organic fertilizer"])

  // ✅ *Customer Ratings & Reviews*
  ratings: {
    totalRatings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        reviewText: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },

  // ✅ *Shipping & Logistics*
  shipping: {
    weight: { type: Number, required: false }, // In kg or liters
    dimensions: {
      length: { type: Number, required: false },
      width: { type: Number, required: false },
      height: { type: Number, required: false },
    },
    deliveryTimeInDays: { type: Number, default: 3 }, // Estimated delivery time
  },

  returnPolicy: { type: String, default: "7-day return available" },
  isActive: { type: Boolean, default: true }, // Product visibility
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
