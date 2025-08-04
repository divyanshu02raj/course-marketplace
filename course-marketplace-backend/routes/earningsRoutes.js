const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");

// Import all controller functions
const { 
    getInstructorEarnings,
    getInstructorStats,
    getPerformanceChartData,
    getDashboardSummary // Import the new function
} = require("../controllers/earningsController");

// --- Earnings Routes ---

// GET /api/earnings - Get all earnings data for the main earnings page
router.get("/", protect, instructorOnly, getInstructorEarnings);

// GET /api/earnings/instructor-stats - Get stats for the dashboard cards
router.get("/instructor-stats", protect, instructorOnly, getInstructorStats);

// GET /api/earnings/performance-chart - Get data for the dashboard chart
router.get("/performance-chart", protect, instructorOnly, getPerformanceChartData);

// GET /api/earnings/dashboard-summary - Get data for the "What's New" section
router.get("/dashboard-summary", protect, instructorOnly, getDashboardSummary);

module.exports = router;
