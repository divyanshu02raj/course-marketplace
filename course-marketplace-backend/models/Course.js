// models/Course.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  shortDesc: String,
  description: String,
  category: String,
  price: Number,
  thumbnail: {
  type: String,
  default: "",
},

  status: {
    type: String,
    enum: ["draft", "published", "unpublished"],
    default: "draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", CourseSchema);