const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Otp = require("../models/otp");
const {sendSms} = require("../services/smsService");


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, mobile: user.mobile },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

//@desc POST /api/user/otp
//@access Public
const sendOtp = asyncHandler(async (req, res) => {
  console.log('i am in sendOtp');
  const { mobile } = req.body;
  console.log("Mobile : " , mobile);
  
  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000);
  
  const existingOtp = await Otp.findOne({ mobile });
  if (existingOtp) {
    // Update the existing OTP
    existingOtp.otp = otp;
    await existingOtp.save();
  } else {
    // Create a new OTP document
    await Otp.create({ mobile, otp });
  }

  console.log("OTP : " , otp);
  // Send OTP to user's mobile number
  await sendSms(mobile, otp);
  res.status(200).json({
    message: "OTP sent successfully"
  });
});

//DESC POST /api/user/verify
//ACCESS Public
const verifyOtp = async (req, res) => {
  try {
    console.log('i am in verifyOtp');
    const { mobile, otp } = req.body;
    console.log("Mobile : " , mobile);
    console.log("OTP : " , otp);

        // Find OTP for the provided mobile number
    const existingOtp = await Otp.findOne({ mobile });
    if (!existingOtp) {
      return res.status(404).json({ error: "OTP not found. Please request a new OTP." });
    }

    // Check if the provided OTP matches
    if (existingOtp.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }
   
    // Find the user associated with the mobile number
    const user = await User.findOne({ mobile });

    // If OTP is correct and user is found
    if (user) {
      const token = generateToken(user);
      return res.status(200).json({user,token});
    }

    await Otp.findOneAndUpdate({ mobile }, { isVerified: true });

    // If OTP is correct but user is not found
    return res.status(200).json({
      message: "OTP verified successfully. User not found.",
      user: null, // Explicitly set user as null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};


//desc POST /api/user/resendOtp
//ACCESS Public
const resendOtp = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  console.log("Mobile : " , mobile);
  const existingOtp = await Otp.findOne({ mobile });
  if (!existingOtp) {
    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log("OTP : " , otp);  
    // Create a new OTP document
    await Otp.create({ mobile, otp });

    console.log("OTP : " , otp);
    // Send OTP to user's mobile number
    await sendSms(mobile, otp);
    res.status(200).json({
      message: "OTP sent successfully"
    });
  }

  console.log("OTP - here : " , existingOtp.otp);
  const otp = existingOtp.otp;
  // Send the existing OTP again
  await sendSms(mobile, otp);
  res.status(200).json({
    message: "OTP sent successfully"
  });
});

module.exports = { sendOtp, verifyOtp, resendOtp };