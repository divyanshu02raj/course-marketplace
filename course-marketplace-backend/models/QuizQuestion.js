// NEW FILE: models/QuizQuestion.js
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
    validate: [arr => arr.length >= 2, 'Must have at least 2 options']
  },
  correctAnswer: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("QuizQuestion", QuizQuestionSchema);
    