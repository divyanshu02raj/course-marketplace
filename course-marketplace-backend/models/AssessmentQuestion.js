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
  // Field to support images or videos in questions
  media: {
    mediaType: { // Corrected field name for clarity
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
  // Options for multiple-choice questions
  options: [
    {
      type: String,
      trim: true,
    },
  ],
  // The correct answer.
  correctAnswer: {
    type: String, 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('AssessmentQuestion', assessmentQuestionSchema);
