// course-marketplace-backend\routes\messageRoutes.js
const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const { 
    getConversations, 
    getMessagesForConversation, 
    sendMessage,
    sendBroadcastMessage,
    findOrCreateConversation
} = require("../controllers/messageController");

// --- Conversation Management ---

// Find or create a direct conversation with another user.
router.post("/conversation", protect, findOrCreateConversation);

// Get all conversations for the logged-in user (for the chat sidebar).
router.get("/", protect, getConversations);

// Get all messages (the chat history) for a specific conversation.
router.get("/:conversationId", protect, getMessagesForConversation);


// --- Message Handling ---

// Send a new direct message.
router.post("/", protect, sendMessage);

// Send a broadcast message to all students in a course (instructor only).
router.post("/broadcast/:courseId", protect, instructorOnly, sendBroadcastMessage);

module.exports = router;