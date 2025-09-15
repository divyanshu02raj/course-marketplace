// course-marketplace-backend\routes\quizRoutes.js
const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const {
    getQuizForLesson,
    addQuestionToQuiz,
    updateQuestion,
    deleteQuestion,
    getQuizForStudent,
    submitQuizAttempt
} = require("../controllers/quizController");

// --- Instructor Routes ---
// Get (or create) a quiz and its questions for a lesson
router.get("/:lessonId", protect, instructorOnly, getQuizForLesson);
// Add a new question to a quiz
router.post("/:quizId/questions", protect, instructorOnly, addQuestionToQuiz);
// Update a specific question
router.patch("/questions/:questionId", protect, instructorOnly, updateQuestion);
// Delete a specific question
router.delete("/questions/:questionId", protect, instructorOnly, deleteQuestion);

// --- Student Routes ---
// Get a quiz to take (questions without answers)
router.get("/:lessonId/take", protect, getQuizForStudent);
// Submit answers for a quiz
router.post("/:quizId/submit", protect, submitQuizAttempt);

module.exports = router;