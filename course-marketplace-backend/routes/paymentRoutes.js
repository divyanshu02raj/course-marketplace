// course-marketplace-backend\routes\paymentRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createRazorpayOrder, verifyRazorpayPayment } = require("../controllers/paymentController");

// Creates a Razorpay order to initiate a transaction.
router.post("/create-order", protect, createRazorpayOrder);

// Verifies the payment after the user completes the transaction and enrolls them in the course.
router.post("/verify/:courseId", protect, verifyRazorpayPayment);

module.exports = router;