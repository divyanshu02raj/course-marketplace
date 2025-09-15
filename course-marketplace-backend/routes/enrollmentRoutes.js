// course-marketplace-backend\routes\enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const { 
    getEnrollmentProgress, 
    markLessonAsComplete,
    getEnrolledStudentsForCourse
} = require("../controllers/enrollmentController");

// --- Student Routes ---
router.get("/:courseId/progress", protect, getEnrollmentProgress);
router.post("/:courseId/lessons/:lessonId/complete", protect, markLessonAsComplete);

// --- Instructor Route ---
router.get("/:courseId/students", protect, instructorOnly, getEnrolledStudentsForCourse);

module.exports = router;