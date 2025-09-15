// course-marketplace-backend\models\Enrollment.js
const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
  }],
  // A denormalized percentage value for quick progress lookups and display.
  progress: { 
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// This unique index ensures that a user can only be enrolled in a specific course once.
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", EnrollmentSchema);