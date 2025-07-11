// routes/lessonRoutes.js
const express = require("express");
const router = express.Router();
const {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");
const { protect, instructorOnly } = require("../middleware/authMiddleware");

// Instructor creates lesson for a course
router.post("/:courseId", protect, instructorOnly, createLesson);

// Get all lessons for a course
router.get("/:courseId", protect, getLessonsByCourse);

// Update a lesson
router.patch("/:lessonId", protect, instructorOnly, updateLesson);

// Delete a lesson
router.delete("/:lessonId", protect, instructorOnly, deleteLesson);

module.exports = router;
