const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Seller = require("../models/seller"); // Updated: Seller model instead of User
const Otp = require("../models/otp");
const { sendSms } = require("../services/smsService");

// Function to generate JWT token
const generateToken = (seller) => {
  return jwt.sign(
    { id: seller._id, name: seller.name, mobile: seller.mobile },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// @desc   Send OTP to seller's mobile number
// @route  POST /api/seller/otp
// @access Public
const sendOtp = asyncHandler(async (req, res) => {
  console.log("i am in sendOtp");
  const { mobile } = req.body;
  console.log("Mobile: ", mobile);

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Check if OTP already exists for the mobile number
  const existingOtp = await Otp.findOne({ mobile });
  if (existingOtp) {
    existingOtp.otp = otp;
    await existingOtp.save();
  } else {
    await Otp.create({ mobile, otp });
  }

  console.log("OTP: ", otp);
  await sendSms(mobile, otp);

  res.status(200).json({ message: "OTP sent successfully" });
});

// @desc   Verify OTP
// @route  POST /api/seller/verify
// @access Public
const verifyOtp = asyncHandler(async (req, res) => {
  try {
    console.log("i am in verifyOtp");
    const { mobile, otp } = req.body;
    console.log("Mobile: ", mobile);
    console.log("OTP: ", otp);

    // Find OTP for the provided mobile number
    const existingOtp = await Otp.findOne({ mobile });
    if (!existingOtp) {
      return res
        .status(404)
        .json({ error: "OTP not found. Please request a new OTP." });
    }

    // Validate OTP
    if (existingOtp.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // Find the seller associated with the mobile number
    const seller = await Seller.findOne({ mobile });

    if (seller) {
      const token = generateToken(seller);
      return res.status(200).json({ seller, token });
    }

    await Otp.findOneAndUpdate({ mobile }, { isVerified: true });

    return res.status(200).json({
      message: "OTP verified successfully. Seller not found.",
      seller: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// @desc   Resend OTP
// @route  POST /api/seller/resendOtp
// @access Public
const resendOtp = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  console.log("Mobile: ", mobile);

  const existingOtp = await Otp.findOne({ mobile });

  if (!existingOtp) {
    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log("New OTP: ", otp);

    await Otp.create({ mobile, otp });

    await sendSms(mobile, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  }

  console.log("Existing OTP: ", existingOtp.otp);
  await sendSms(mobile, existingOtp.otp);

  res.status(200).json({ message: "OTP sent successfully" });
});

module.exports = { sendOtp, verifyOtp, resendOtp };
