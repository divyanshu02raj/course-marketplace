// routes/questionRoutes.js
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
// GET /api/questions/instructor - Get all unanswered questions for an instructor
router.get("/instructor", protect, instructorOnly, getUnansweredQuestionsForInstructor);

// --- Student & General Routes ---
// GET /api/questions/:lessonId - Get questions for a specific lesson
router.get("/:lessonId", protect, getQuestionsForLesson);

// POST /api/questions/:lessonId - Post a new question to a lesson
router.post("/:lessonId", protect, askQuestion);

// POST /api/questions/answer/:questionId - Post an answer to a question
router.post("/answer/:questionId", protect, answerQuestion);

module.exports = router;
