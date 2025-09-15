// course-marketplace-backend\models\Lesson.js
const mongoose = require("mongoose");

// A sub-schema for downloadable resources attached to a lesson.
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
  // If true, this lesson can be viewed by users who are not enrolled in the course.
  isPreview: {
    type: Boolean,
    default: false,
  },
  resources: [ResourceSchema],
  // A flag to indicate if a lesson has an associated quiz.
  // This is managed by the quizController to help the UI display a quiz icon.
  hasQuiz: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Lesson", LessonSchema);