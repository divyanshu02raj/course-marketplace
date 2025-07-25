// controllers/lessonController.js
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

// Create a new lesson
exports.createLesson = async (req, res) => {
  const { courseId } = req.params;
  // Use 'content' instead of 'notes'
  const { title, videoUrl, content, order, duration, isPreview, resources } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found." });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to add lessons to this course." });
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      videoUrl,
      content, // ✅ Use 'content'
      order,
      duration,
      isPreview,
      resources,
    });

    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Failed to create lesson.", error: err.message });
  }
};

// Get lessons for a specific course
exports.getLessonsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve lessons.", error: err.message });
  }
};

// Update a lesson
exports.updateLesson = async (req, res) => {
  const { lessonId } = req.params;
  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found." });

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this lesson." });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedLesson);
  } catch (err) {
    res.status(500).json({ message: "Failed to update lesson.", error: err.message });
  }
};

// Delete a lesson
exports.deleteLesson = async (req, res) => {
  const { lessonId } = req.params;
  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found." });

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this lesson." });
    }

    await lesson.deleteOne();
    res.json({ message: "Lesson deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete lesson.", error: err.message });
  }
};
