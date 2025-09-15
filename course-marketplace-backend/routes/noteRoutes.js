// course-marketplace-backend\routes\noteRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getNoteForLesson, saveNote } = require("../controllers/noteController");

// Get the user's note for a specific lesson.
router.get("/:lessonId", protect, getNoteForLesson);

// Create or update a user's note for a lesson.
router.post("/:lessonId", protect, saveNote);

module.exports = router;