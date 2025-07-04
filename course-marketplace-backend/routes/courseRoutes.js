const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const { createCourse, getMyCourses } = require("../controllers/courseController");

// Create a new course
router.post("/", protect, instructorOnly, createCourse);

// ✅ Get instructor’s courses
router.get("/my", protect, instructorOnly, getMyCourses);

module.exports = router;
