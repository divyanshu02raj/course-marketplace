// NEW FILE: models/Message.js
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
  readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  }]
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);