//course-marketplace-backend\models\AssessmentQuestion.js
const mongoose = require('mongoose');

const assessmentQuestionSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  // Optional media (image or video) to be displayed with the question.
  media: {
    mediaType: {
      type: String,
      enum: ['image', 'video'],
    },
    url: {
      type: String,
      trim: true,
    },
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-in-the-blank'],
    default: 'multiple-choice',
  },
  // An array of possible answers, used primarily for 'multiple-choice' questions.
  options: [
    {
      type: String,
      trim: true,
    },
  ],
  // Stores the correct answer. The expected value depends on the questionType.
  // For 'multiple-choice', it's the string of the correct option.
  // For 'true-false', it's "True" or "False".
  // For 'fill-in-the-blank', it's the expected text.
  correctAnswer: {
    type: String, 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('AssessmentQuestion', assessmentQuestionSchema);