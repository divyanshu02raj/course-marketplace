// models/Lesson.js
const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
});

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
  content: String,
  order: Number,
  duration: Number,
  isPreview: {
    type: Boolean,
    default: false,
  },
  resources: [ResourceSchema],
  hasQuiz: { // ✅ Add this new field
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Lesson", LessonSchema);