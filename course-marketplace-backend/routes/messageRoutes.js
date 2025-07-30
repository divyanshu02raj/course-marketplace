// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const { 
    getConversations, 
    getMessagesForConversation, 
    sendMessage,
    sendBroadcastMessage
} = require("../controllers/messageController");

// Get all conversations for the logged-in user
router.get("/", protect, getConversations);

// Get all messages for a specific conversation
router.get("/:conversationId", protect, getMessagesForConversation);

// Send a new direct message
router.post("/", protect, sendMessage);

// Send a broadcast message to a course (instructors only)
router.post("/broadcast/:courseId", protect, instructorOnly, sendBroadcastMessage);

module.exports = router;
