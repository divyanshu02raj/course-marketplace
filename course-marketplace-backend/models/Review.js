// course-marketplace-backend\models\Review.js
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
  // The star rating given by the user, constrained from 1 to 5.
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

// This unique index ensures that a user can only submit one review per course.
ReviewSchema.index({ course: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);