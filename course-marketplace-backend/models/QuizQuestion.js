// course-marketplace-backend\models\QuizQuestion.js
const mongoose = require("mongoose");

const QuizQuestionSchema = new mongoose.Schema({
  quiz: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Quiz", 
    required: true 
  },
  questionText: { 
    type: String, 
    required: true 
  },
  options: {
    type: [String],
    required: true,
    // A custom validator to ensure every multiple-choice question has at least two options.
    validate: [arr => arr.length >= 2, 'Must have at least 2 options']
  },
  // The correct answer, which must be a string that exactly matches one of the values in the 'options' array.
  correctAnswer: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("QuizQuestion", QuizQuestionSchema);