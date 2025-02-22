const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  sendOtp,
  verifyOtp,
  resendOtp,
} = require("../controllers/otpController");
console.log("user.js");
router.post("/", createUser);
router.post("/otp", sendOtp);
router.post("/verify", verifyOtp);
router.post("/resend", resendOtp);

router.use(validateToken);

router.get("/all", getUsers);

router.get("/", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
