// course-marketplace-backend\routes\questionRoutes.js
const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const { 
    getQuestionsForLesson, 
    askQuestion, 
    answerQuestion,
    getUnansweredQuestionsForInstructor
} = require("../controllers/questionController");

// --- Instructor Route ---

// For an instructor to get all their unanswered questions.
router.get("/instructor", protect, instructorOnly, getUnansweredQuestionsForInstructor);

// --- Student & General Routes ---

// Get the Q&A thread for a specific lesson.
router.get("/:lessonId", protect, getQuestionsForLesson);

// Ask a new question on a lesson.
router.post("/:lessonId", protect, askQuestion);

// Post an answer to a question (controller handles instructor-only logic).
router.post("/answer/:questionId", protect, answerQuestion);

module.exports = router;