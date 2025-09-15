// course-marketplace-backend\models\Question.js
const mongoose = require("mongoose");

// A sub-schema defining the structure for an answer.
// This will be embedded within the main QuestionSchema.
const AnswerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const QuestionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  // An array containing embedded answer documents.
  // This is efficient for a Q&A feature as the question and its answers can be fetched in a single query.
  answers: [AnswerSchema],
}, { timestamps: true });

module.exports = mongoose.model("Question", QuestionSchema);