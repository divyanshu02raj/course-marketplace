// course-marketplace-backend\models\Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // An array of user IDs who have read this message.
  // This is used to implement read receipts (e.g., "seen by") in the chat UI.
  readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  }]
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);