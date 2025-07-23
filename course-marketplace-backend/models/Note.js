// models/Note.js
const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  lesson: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lesson", 
    required: true 
  },
  content: { 
    type: String, 
    default: "" 
  },
}, { timestamps: true });

// Create a compound index to ensure a user has only one note per lesson
NoteSchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model("Note", NoteSchema);
