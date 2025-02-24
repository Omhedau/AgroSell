const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Seller = require("../models/seller");
const Otp = require("../models/otp");

// JWT Token Generation Function
const generateToken = (seller) => {
  return jwt.sign(
    { id: seller._id, username: seller.username, email: seller.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// @desc Get All Sellers
// @route GET /api/seller
// @access Public
const getSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find().select("-password");
  if (sellers.length > 0) {
    res.status(200).json({ message: "Sellers found", sellers });
  } else {
    res.status(404);
    throw new Error("No sellers found");
  }
});

// @desc Get Seller Details
// @route GET /api/seller/:id
// @access Public
const getSeller = asyncHandler(async (req, res) => {
  const sellerId = req.params.id;
  const seller = await Seller.findById(sellerId).select("-password");
  if (seller) {
    res.status(200).json({ message: "Seller found", seller });
  } else {
    res.status(404);
    throw new Error("Seller not found");
  }
});

// @desc Create a New Seller
// @route POST /api/seller
// @access Public
const createSeller = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, password, gender } = req.body;

  // Check if phone number is verified
  const isVerified = await Otp.findOne({
    mobile: phoneNumber,
    isVerified: true,
  });
  
  if (!isVerified) {
    res.status(400);
    throw new Error("Phone number not verified");
  }

  // Check if seller already exists
  const existingSeller = await Seller.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (existingSeller) {
    res.status(400);
    throw new Error("Seller already exists with this email or phone number");
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create Seller
  const seller = await Seller.create({
    username,
    email,
    phoneNumber,
    password: hashedPassword,
    gender,
    storeDetails: {},
    storeAddress: {},
    bankDetails: {},
  });

  if (seller) {
    const token = generateToken(seller);
    res.status(201).json({ seller, token });
  } else {
    res.status(400);
    throw new Error("Invalid seller data");
  }
});

// @desc Update Seller Profile
// @route PUT /api/seller/:id
// @access Private (Authenticated Seller)
const updateSeller = asyncHandler(async (req, res) => {
  const sellerId = req.params.id;
  const seller = await Seller.findById(sellerId);

  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }

  // Update seller details
  const updatedSeller = await Seller.findByIdAndUpdate(sellerId, req.body, {
    new: true,
  }).select("-password");

  res.status(200).json({
    message: "Seller updated successfully",
    seller: updatedSeller,
  });
});

// @desc Delete Seller
// @route DELETE /api/seller/:id
// @access Private (Admin)
const deleteSeller = asyncHandler(async (req, res) => {
  const sellerId = req.params.id;
  const seller = await Seller.findByIdAndDelete(sellerId);

  if (seller) {
    res.status(200).json({ message: "Seller removed successfully" });
  } else {
    res.status(404);
    throw new Error("Seller not found");
  }
});

// @desc Seller Login
// @route POST /api/seller/login
// @access Public
const loginSeller = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  // Find seller by phone number
  const seller = await Seller.findOne({ phoneNumber });

  if (seller && (await bcrypt.compare(password, seller.password))) {
    const token = generateToken(seller);
    res.status(200).json({ seller, token });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc Verify OTP and Activate Seller Account
// @route POST /api/seller/verify-otp
// @access Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const validOtp = await Otp.findOne({ mobile: phoneNumber, otp });

  if (!validOtp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // Mark OTP as verified and delete it
  await Otp.findOneAndUpdate({ mobile: phoneNumber }, { isVerified: true });
  res.status(200).json({ message: "OTP verified successfully" });
});

module.exports = {
  getSellers,
  getSeller,
  createSeller,
  updateSeller,
  deleteSeller,
  loginSeller,
  verifyOtp,
};
