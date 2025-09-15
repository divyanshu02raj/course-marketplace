//course-marketplace-backend/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
    getNotifications,
    markNotificationsAsRead
} = require('../controllers/notificationController');

// GET /api/notifications - Get all notifications and unread count
router.get('/', protect, getNotifications);

// POST /api/notifications/mark-read - Mark all notifications as read
router.post('/mark-read', protect, markNotificationsAsRead);

module.exports = router;