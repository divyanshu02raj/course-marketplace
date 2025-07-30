// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const { 
    getConversations, 
    getMessagesForConversation, 
    sendMessage,
    sendBroadcastMessage,
    findOrCreateConversation // ✅ 1. Import the new function
} = require("../controllers/messageController");

// ✅ 2. Add the new route for starting a conversation
router.post("/conversation", protect, findOrCreateConversation);

// --- Existing Routes ---
router.get("/", protect, getConversations);
router.get("/:conversationId", protect, getMessagesForConversation);
router.post("/", protect, sendMessage);
router.post("/broadcast/:courseId", protect, instructorOnly, sendBroadcastMessage);

module.exports = router;
