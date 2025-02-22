const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Otp = require("../models/otp");
const {sendSms} = require("../services/smsService");

//@desc Get All users
//@route GET /api/user
//@access Public

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, mobile: user.mobile },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  if (users) {
    res.status(200).json({
      message: "Users found",
      users
    });
  } else {
    res.status(404);
    throw new Error("No users found");
  }
});

//@desc Get user details
//@route GET /api/user/:id
//@access Public
const getUser = asyncHandler(async (req, res) => {
  console.log('i am in getUser');
  console.log('req.user', req.user);
  const userId = req.user.id;
  console.log('userId', userId);
  const user  = await User.findById(userId);
  if (user) {
    console.log('user found in getUser');
    res.status(200).json({
      message: "User found",
      user
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  } 
});

//@desc Create a user
//@route POST /api/user
//@access Public
const createUser = asyncHandler(async (req, res) => {
  const userDetails = req.body;
   console.log('i am in createUser');
  const isVerified = await Otp.findOne({ mobile: userDetails.mobile, isVerified: true });
  if (!isVerified) {
    res.status(400);
    throw new Error("Mobile number not verified");
  }
  console.log("i am user", userDetails);

  const user = await User.create(userDetails);
  console.log("i am mongoman", user);
  if (user) {

    const token = generateToken(user);

    console.log("i am token", token);

    res.status(201).json({ user, token });
  }
  else {
    res.status(400);
    throw new Error("Invalid user data");
  }
  
});

//@desc Update a user
//@route PUT /api/user/:id
//@access Public
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const userDetails = req.body;
  const user = await User.findById(userId);
  if (user) {
    // userDetails is updated data lets update it
    const updatedUser = await User.findByIdAndUpdate(userId, userDetails);
    res.status(200).json({
      message: "User updated",
      user: userDetails
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Delete a user
//@route DELETE /api/user/:id
//@access Public
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  if (user) {
    res.status(200).json({
      message: "User removed"
    });
  }
  else {
    res.status(404);
    throw new Error("User not found");
  }
});



module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };