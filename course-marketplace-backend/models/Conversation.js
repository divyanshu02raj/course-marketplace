// course-marketplace-backend\models\Conversation.js
const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  // If this field is present, the conversation is a group chat for a specific course (e.g., for broadcasts).
  // If it's null, it's a direct message between participants.
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  // A denormalized copy of the last message sent in this conversation.
  // This is a performance optimization to avoid complex queries when displaying and sorting the conversation list.
  lastMessage: {
    text: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now }
  }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);