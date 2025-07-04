// controllers/courseController.js
const Course = require("../models/Course");

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructors only)
const createCourse = async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      instructor: req.user._id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all courses by the logged-in instructor
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

module.exports = { createCourse, getMyCourses };
