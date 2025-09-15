//course-marketplace-backend\models\AssessmentAttempt.js
const mongoose = require('mongoose');

const assessmentAttemptSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssessmentQuestion',
      },
      // Records the exact answer the student submitted for the question.
      answer: String, 
    }
  ],
  score: {
    // The final calculated score as a percentage (e.g., 85 for 85%).
    type: Number, 
    required: true,
  },
  passed: {
    // A boolean flag indicating if the score was >= the assessment's passingScore.
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

// Creates a compound index to speed up queries for finding attempts by a specific student on a specific assessment.
assessmentAttemptSchema.index({ assessment: 1, student: 1 });

module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);