// models/Enrollment.js
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
  progress: { // A percentage value for quick lookups
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Ensure a user can only be enrolled in a course once
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
