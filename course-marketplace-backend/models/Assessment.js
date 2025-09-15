// course-marketplace-backend\models\Assessment.js
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    // This ensures that each course can only have one final assessment.
    unique: true, 
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Final Assessment',
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentQuestion',
    },
  ],
  passingScore: {
    type: Number,
    // The percentage (e.g., 75%) a student must achieve to pass the assessment.
    default: 75,
    min: 0,
    max: 100,
  },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);