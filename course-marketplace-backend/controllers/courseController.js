// course-marketplace-backend/controllers/courseController.js
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment"); 
const Assessment = require("../models/Assessment");
const Certificate = require("../models/Certificate");
const AssessmentAttempt = require("../models/AssessmentAttempt");


// --- Public & Student Functions ---

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

// Gets all courses a student is enrolled in, and attaches their current progress to each.
const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user._id;

        const enrollments = await Enrollment.find({ user: userId })
            .populate({
                path: 'course',
                populate: {
                    path: 'instructor',
                    select: 'name'
                }
            })
            .sort({ createdAt: -1 });

        // Map through enrollments to return a clean array of course objects with progress.
        const coursesWithProgress = enrollments.map(enrollment => {
            if (!enrollment.course) return null; // Handle cases where a course might have been deleted
            
            const courseObject = enrollment.course.toObject();
            courseObject.progress = enrollment.progress || 0; // Attach progress from the enrollment doc
            return courseObject;
        }).filter(course => course !== null);

        res.json(coursesWithProgress);
    } catch (err) {
        console.error("Get Enrolled Courses Error:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

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

    // Enrollment requires two steps: creating an Enrollment document and updating the Course.
    const enrollment = new Enrollment({
        user: userId,
        course: courseId,
    });
    
    course.enrolledStudents.push(userId);
    
    // Run both database saves in parallel for efficiency.
    await Promise.all([course.save(), enrollment.save()]);

    res.status(200).json({ message: "Successfully enrolled in the course" });
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ message: "Server error during enrollment" });
  }
};


// --- Instructor-Only Functions ---

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

const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Gets a single course and enriches it with the current student's assessment/certificate status.
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("instructor", "name email")
            .lean();

        if (!course) return res.status(404).json({ message: "Course not found" });

        const studentId = req.user._id;
        const assessment = await Assessment.findOne({ course: course._id }).lean();
        
        // If an assessment exists, check if the student has passed it and earned a certificate.
        if (assessment) {
            course.assessmentId = assessment._id;
            const passedAttempt = await AssessmentAttempt.findOne({
                assessment: assessment._id,
                student: studentId,
                passed: true
            });

            if (passedAttempt) {
                const certificate = await Certificate.findOne({
                    course: course._id,
                    user: studentId
                }).lean();
                if (certificate) {
                    course.certificateId = certificate.certificateId;
                }
            }
        }

        res.json(course);
    } catch (err) {
        res.status(500).json({ message: "Error fetching course: " + err.message });
    }
};

const updateCourse = async (req, res) => {
  try {
    // This query atomically finds the course by its ID and verifies the user is the instructor.
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