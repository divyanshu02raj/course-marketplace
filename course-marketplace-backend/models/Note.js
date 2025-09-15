// course-marketplace-backend\models\Note.js
const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  // Storing the course ID here (in addition to the lesson) simplifies queries,
  // e.g., finding all of a user's notes for a particular course.
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

// This unique index ensures that a user can have only one note document per lesson.
NoteSchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model("Note", NoteSchema);