// controllers/courseController.js
const Course = require("../models/Course");

// --- Public & Student Functions ---

// Get all published courses for the student view
const getAllPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" })
      .populate("instructor", "name")
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Get courses a student is enrolled in
const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user._id;
        const courses = await Course.find({ enrolledStudents: userId })
            .populate("instructor", "name")
            .sort({ createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

// Enroll a student in a course
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.status !== 'published') {
      return res.status(400).json({ message: "This course is not available for enrollment." });
    }

    if (course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    course.enrolledStudents.push(userId);
    await course.save();

    res.status(200).json({ message: "Successfully enrolled in the course" });
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ message: "Server error during enrollment" });
  }
};


// --- Instructor-Only Functions ---

// Create a new course
const createCourse = async (req, res) => {
  try {
    const thumbnailUrl = req.body.thumbnail || "";
    const course = new Course({
      ...req.body,
      instructor: req.user._id,
      thumbnail: thumbnailUrl,
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error("Course creation failed:", err);
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

// Get a course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course: " + err.message });
  }
};

// Update a course by ID
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ message: "Course not found or unauthorized" });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: "Error updating course: " + err.message });
  }
};

// Toggle published/draft status
const updateCourseStatus = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }
    const { status } = req.body;
    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    course.status = status;
    await course.save();
    res.status(200).json({ status: course.status });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a course by ID
const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findOneAndDelete({ _id: req.params.id, instructor: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Course not found or unauthorized" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course: " + err.message });
  }
};

module.exports = {
  getAllPublishedCourses,
  getEnrolledCourses,
  enrollInCourse,
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
};
