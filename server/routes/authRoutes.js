const express = require("express");
const router = express.Router();

const { registerUser, verifyOTP, loginUser, resendOTP } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/resend-otp", resendOTP);

module.exports = router;