// routes/earningsRoutes.js
const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const { getInstructorEarnings } = require("../controllers/earningsController");

// GET /api/earnings - Get all earnings data for the logged-in instructor
router.get("/", protect, instructorOnly, getInstructorEarnings);

module.exports = router;
