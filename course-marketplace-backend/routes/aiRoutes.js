//course-marketplace-backend\routes\aiRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { summarizeContent } = require('../controllers/aiController');

// POST /api/ai/summarize
router.post('/summarize', protect, summarizeContent);

module.exports = router;