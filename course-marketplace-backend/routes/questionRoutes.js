// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
// We will create the controller functions later, for now we use placeholders
const { getQuestionsForLesson, askQuestion, answerQuestion } = {
    getQuestionsForLesson: (req, res) => res.json([]),
    askQuestion: (req, res) => res.status(201).json({ message: "Question asked" }),
    answerQuestion: (req, res) => res.status(201).json({ message: "Answer posted" }),
};

// Get all questions for a specific lesson
router.get("/:lessonId", protect, getQuestionsForLesson);

// Post a new question to a lesson
router.post("/:lessonId", protect, askQuestion);

// Post an answer to a question
router.post("/answer/:questionId", protect, answerQuestion);

module.exports = router;