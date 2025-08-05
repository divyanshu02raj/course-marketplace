const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');

/**
 * @desc    Get summary statistics for the student dashboard
 * @route   GET /api/dashboard/student-summary
 * @access  Private (Student)
 */
exports.getStudentDashboardSummary = async (req, res) => {
    try {
        const studentId = req.user._id;

        // 1. Get all enrollments for the student
        const enrollments = await Enrollment.find({ user: studentId });

        // 2. Calculate stats from enrollments
        const coursesInProgress = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
        const completedCourses = enrollments.filter(e => e.progress === 100).length;

        // 3. Get the 3 most recently issued certificates
        const recentCertificates = await Certificate.find({ user: studentId })
            .sort({ issueDate: -1 })
            .limit(3)
            .populate('course', 'title thumbnail');

        res.json({
            coursesInProgress,
            completedCourses,
            certificatesEarned: await Certificate.countDocuments({ user: studentId }),
            recentCertificates
        });

    } catch (error) {
        console.error("Get Student Dashboard Summary Error:", error);
        res.status(500).json({ message: "Server error while fetching dashboard data." });
    }
};
