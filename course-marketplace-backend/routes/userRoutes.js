// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMessageContacts } = require("../controllers/userController");

// GET /api/users/message-contacts - Get a list of users the current user can message
router.get("/message-contacts", protect, getMessageContacts);

module.exports = router;
