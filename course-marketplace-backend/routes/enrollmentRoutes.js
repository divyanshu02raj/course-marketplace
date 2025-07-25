// routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getEnrollmentProgress, markLessonAsComplete } = require("../controllers/enrollmentController");

// Get a user's progress for a specific course
router.get("/:courseId/progress", protect, getEnrollmentProgress);

// Mark a lesson as complete
router.post("/:courseId/lessons/:lessonId/complete", protect, markLessonAsComplete);

module.exports = router;
