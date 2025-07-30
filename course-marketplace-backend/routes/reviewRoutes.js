// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createReview, getReviewsForCourse } = require("../controllers/reviewController");

// POST /api/reviews/:courseId - Create a new review for a course
router.post("/:courseId", protect, createReview);

// GET /api/reviews/:courseId - Get all reviews for a course
router.get("/:courseId", getReviewsForCourse); // This can be public

module.exports = router;
