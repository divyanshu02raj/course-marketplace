// course-marketplace-backend/routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createReview, getReviewsForCourse } = require("../controllers/reviewController");

// POST /api/reviews/:courseId - Create a new review for a course (requires login).
router.post("/:courseId", protect, createReview);

// GET /api/reviews/:courseId - Get all reviews for a course (publicly accessible).
router.get("/:courseId", getReviewsForCourse);

module.exports = router;