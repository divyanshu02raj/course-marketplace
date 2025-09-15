// course-marketplace-backend\models\Transaction.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  // Stores the unique identifier from the payment gateway (Razorpay).
  paymentId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);