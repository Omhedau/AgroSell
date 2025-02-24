const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  getSellers,
  getSeller,
  createSeller,
  updateSeller,
  deleteSeller,
} = require("../controllers/sellerController");
const {
  sendOtp,
  verifyOtp,
  resendOtp,
} = require("../controllers/otpController");

console.log("seller.js");

// Seller Signup & OTP Verification
router.post("/", createSeller);
router.post("/otp", sendOtp);
router.post("/verify", verifyOtp);
router.post("/resend", resendOtp);

// Secure routes (Requires authentication)
router.use(validateToken);

router.get("/all", getSellers);
router.get("/", getSeller);
router.put("/:id", updateSeller);
router.delete("/:id", deleteSeller);

module.exports = router;
