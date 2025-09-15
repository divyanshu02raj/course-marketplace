// course-marketplace-backend\models\Quiz.js
const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  lesson: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lesson", 
    required: true, 
    // This constraint ensures that each lesson can have at most one quiz.
    unique: true 
  },
  // Storing the course ID directly on the quiz simplifies queries,
  // for example, when finding all quizzes associated with a course.
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