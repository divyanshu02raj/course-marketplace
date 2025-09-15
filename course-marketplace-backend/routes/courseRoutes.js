// course-marketplace-backend\routes\courseRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllPublishedCourses,
  getEnrolledCourses,
  enrollInCourse,
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
} = require("../controllers/courseController");
const { protect, instructorOnly } = require("../middleware/authMiddleware");

// --- Public & Student Routes ---

// GET /api/courses - Fetch all published courses for anyone to see.
router.get("/", getAllPublishedCourses);

// GET /api/courses/enrolled - Get courses for the logged-in student.
// This specific path must be defined BEFORE the generic '/:id' route to avoid being mismatched.
router.get("/enrolled", protect, getEnrolledCourses);

// POST /api/courses/:courseId/enroll - Enroll the logged-in student in a course.
router.post("/:courseId/enroll", protect, enrollInCourse);


// --- Instructor-Only Routes ---

// POST /api/courses - Create a new course as an instructor.
router.post("/", protect, instructorOnly, createCourse);

// GET /api/courses/my - Get courses for the logged-in instructor.
// This must also come BEFORE the generic '/:id' route.
router.get("/my", protect, instructorOnly, getMyCourses);


// --- Generic Routes with an ID (Must be last) ---

// GET /api/courses/:id - Get a single course by its ID.
// This generic route will handle any path that wasn't matched by the more specific routes above.
router.get("/:id", protect, getCourseById);

// PATCH /api/courses/:id - Update a course.
router.patch("/:id", protect, instructorOnly, updateCourse);

// PATCH /api/courses/:id/status - Update a course's published status.
router.patch("/:id/status", protect, instructorOnly, updateCourseStatus);

// DELETE /api/courses/:id - Delete a course.
router.delete("/:id", protect, instructorOnly, deleteCourse);

module.exports = router;