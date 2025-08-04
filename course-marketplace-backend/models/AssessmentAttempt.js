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
      answer: String, // The student's submitted answer
    }
  ],
  score: {
    type: Number, // The calculated score (e.g., 85 for 85%)
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

// Ensure a student can't have multiple attempts at the same time
assessmentAttemptSchema.index({ assessment: 1, student: 1 });

module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
