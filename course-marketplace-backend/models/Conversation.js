// NEW FILE: models/Conversation.js
const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  // For broadcast messages from an instructor to a course
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  lastMessage: {
    text: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now }
  }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);