const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    unique: true, // Typically, a course has only one final assessment
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
      ref: 'AssessmentQuestion', // References the new, powerful question model
    },
  ],
  passingScore: {
    type: Number,
    default: 75, // The percentage required to pass (e.g., 75%)
    min: 0,
    max: 100,
  },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
