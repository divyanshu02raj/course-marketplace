// models/Lesson.js
const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  videoUrl: String,
  notes: String,
  order: Number,
  duration: Number, // in minutes (optional)
  isPreview: {
    type: Boolean,
    default: false, // lesson is not a free preview by default
  },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model("Lesson", LessonSchema);
