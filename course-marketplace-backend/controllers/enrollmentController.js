//course-marketplace-backend\controllers\enrollmentController.js
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

exports.getEnrollmentProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;
        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        
        // If no enrollment exists, it simply means the user has not completed any lessons yet.
        if (!enrollment) {
            return res.json({ completedLessons: [] });
        }
        res.json({ completedLessons: enrollment.completedLessons });
    } catch (error) {
        res.status(500).json({ message: "Error fetching progress." });
    }
};

// Updates a student's progress when they complete a lesson.
exports.markLessonAsComplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const userId = req.user._id;

        let enrollment = await Enrollment.findOne({ user: userId, course: courseId });

        // If this is the first lesson the user completes, create the enrollment document.
        if (!enrollment) {
            enrollment = new Enrollment({ user: userId, course: courseId });
        }

        // Add the lesson to the completed list if it's not already there.
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
        }
        
        // Recalculate the overall course progress percentage.
        const totalLessonsInCourse = await Lesson.countDocuments({ course: courseId });
        if (totalLessonsInCourse > 0) {
            enrollment.progress = (enrollment.completedLessons.length / totalLessonsInCourse) * 100;
        }

        await enrollment.save();

        // Note: Certificate generation is intentionally handled in the assessmentController after a 
        // student passes the final assessment, not upon 100% lesson completion.

        res.status(200).json({ message: "Lesson marked as complete.", completedLessons: enrollment.completedLessons });

    } catch (error) {
        console.error("Mark complete error:", error);
        res.status(500).json({ message: "Error updating progress." });
    }
};

// For an instructor, gets a list of all students enrolled in one of their courses.
exports.getEnrolledStudentsForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        // Authorize that the requester is the course instructor.
        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to view this course's enrollments." });
        }

        const enrollments = await Enrollment.find({ course: courseId })
            .populate('user', 'name email profileImage')
            .select('user progress createdAt');

        res.json(enrollments);
    } catch (error) {
        console.error("Get Enrolled Students Error:", error);
        res.status(500).json({ message: "Error fetching enrolled students." });
    }
};