// course-marketplace-backend\routes\dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
    getStudentDashboardSummary
} = require('../controllers/dashboardController');

// --- Student Dashboard Route ---

// GET /api/dashboard/student-summary - Get all summary data for the student dashboard
router.get('/student-summary', protect, getStudentDashboardSummary);

module.exports = router;