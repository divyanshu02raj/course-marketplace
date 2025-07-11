// course-marketplace-backend\routes\courseRoutes.js
const express = require("express");
const router = express.Router();
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const Course = require("../models/Course"); // ✅ Needed for direct access
const {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateCourseStatus, // ✅ Add this
} = require("../controllers/courseController");

// Existing routes
router.post("/", protect, instructorOnly, createCourse);
router.get("/my", protect, instructorOnly, getMyCourses);
router.get("/:id", protect, getCourseById);
router.patch("/:id", protect, instructorOnly, updateCourse);
router.delete("/:id", protect, instructorOnly, deleteCourse);

// ✅ New route: Toggle course status
router.patch("/:id/status", protect,updateCourseStatus, instructorOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Find course and verify ownership
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Update status
    course.status = status;
    await course.save();

    res.json({ message: "Status updated", status: course.status });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ error: "Server error while updating status" });
  }
});

module.exports = router;
