const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

// Get a user's progress for a specific course
exports.getEnrollmentProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;
        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment) {
            return res.json({ completedLessons: [] });
        }
        res.json({ completedLessons: enrollment.completedLessons });
    } catch (error) {
        res.status(500).json({ message: "Error fetching progress." });
    }
};

// Mark a lesson as complete for a user
exports.markLessonAsComplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const userId = req.user._id;

        let enrollment = await Enrollment.findOne({ user: userId, course: courseId });

        if (!enrollment) {
            enrollment = new Enrollment({ user: userId, course: courseId });
        }

        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
        }
        
        const totalLessonsInCourse = await Lesson.countDocuments({ course: courseId });
        if (totalLessonsInCourse > 0) {
            enrollment.progress = (enrollment.completedLessons.length / totalLessonsInCourse) * 100;
        }

        await enrollment.save();

        // ** THE FIX IS HERE **
        // The old logic that automatically created a certificate has been removed.
        // This is now correctly handled in the assessmentController after a student passes.

        res.status(200).json({ message: "Lesson marked as complete.", completedLessons: enrollment.completedLessons });

    } catch (error) {
        console.error("Mark complete error:", error);
        res.status(500).json({ message: "Error updating progress." });
    }
};

// Get all students enrolled in a specific course
exports.getEnrolledStudentsForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

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
