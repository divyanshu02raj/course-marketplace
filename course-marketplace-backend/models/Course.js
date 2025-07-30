// models/Course.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  shortDesc: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  thumbnail: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["draft", "published", "unpublished"],
    default: "draft",
  },
  whatYouWillLearn: {
    type: [String],
    default: [],
  },
  requirements: {
    type: [String],
    default: [],
  },
  targetAudience: {
    type: String,
    default: "",
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  
  // ✅ NEW Fields for ratings and reviews
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true }); // Using timestamps will automatically add createdAt and updatedAt fields

module.exports = mongoose.model("Course", CourseSchema);
