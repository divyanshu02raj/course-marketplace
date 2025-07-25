// NEW FILE: models/Quiz.js
const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  lesson: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lesson", 
    required: true, 
    unique: true // Each lesson can only have one quiz
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    default: 'Lesson Quiz'
  },
}, { timestamps: true });

module.exports = mongoose.model("Quiz", QuizSchema);
