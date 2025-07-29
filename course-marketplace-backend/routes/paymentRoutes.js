// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createRazorpayOrder, verifyRazorpayPayment } = require("../controllers/paymentController");

// Creates a Razorpay order
router.post("/create-order", protect, createRazorpayOrder);

// Verifies the payment and enrolls the user
router.post("/verify/:courseId", protect, verifyRazorpayPayment);

module.exports = router;