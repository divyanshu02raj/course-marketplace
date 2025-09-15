// course-marketplace-backend\models\Course.js
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
  // Controls the visibility and availability of the course.
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
  
  // These fields are denormalized and updated by the reviewController.
  // Storing them here prevents costly aggregation queries when displaying course lists.
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Course", CourseSchema);