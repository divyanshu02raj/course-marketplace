// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const { 
    getQuestionsForLesson, 
    askQuestion, 
    answerQuestion,
    getUnansweredQuestionsForInstructor // 1. Import the new function
} = require("../controllers/questionController");

// ✅ 2. Add the new route for instructors
router.get("/instructor", protect, instructorOnly, getUnansweredQuestionsForInstructor);

// --- Student & General Routes ---
router.get("/:lessonId", protect, getQuestionsForLesson);
router.post("/:lessonId", protect, askQuestion);
router.post("/answer/:questionId", protect, answerQuestion);

module.exports = router;
