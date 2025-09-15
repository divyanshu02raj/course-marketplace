//course-marketplace-backend/routes/lessonRoutes.js
const express = require("express");
const router = express.Router();
const {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");
const { protect, instructorOnly } = require("../middleware/authMiddleware");

// Instructor creates a lesson for a course
router.post("/:courseId", protect, instructorOnly, createLesson);

// Get all lessons for a course
router.get("/:courseId", protect, getLessonsByCourse);

// Update a specific lesson
router.patch("/:lessonId", protect, instructorOnly, updateLesson);

// Delete a specific lesson
router.delete("/:lessonId", protect, instructorOnly, deleteLesson);

module.exports = router;