// models/Review.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Ensure a user can only review a course once
ReviewSchema.index({ course: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
