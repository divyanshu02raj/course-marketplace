// course-marketplace-backend/controllers/dashboardController.js
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');

/**
 * @desc    Get summary statistics for the student dashboard
 * @route   GET /api/dashboard/student-summary
 * @access  Private (Student)
 */
// Aggregates and returns key statistics for the student's main dashboard.
exports.getStudentDashboardSummary = async (req, res) => {
    try {
        const studentId = req.user._id;

        const enrollments = await Enrollment.find({ user: studentId });

        // Calculate progress stats by filtering the student's enrollments in memory.
        const coursesInProgress = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
        const completedCourses = enrollments.filter(e => e.progress === 100).length;

        // Fetch the 5 most recent certificates to display as a preview.
        const recentCertificates = await Certificate.find({ user: studentId })
            .sort({ issueDate: -1 })
            .limit(5)
            .populate('course', 'title thumbnail');
        
        // Before sending, ensure we don't include certificates for courses that might have been deleted.
        const validRecentCertificates = recentCertificates.filter(cert => cert.course).slice(0, 3);

        res.json({
            coursesInProgress,
            completedCourses,
            certificatesEarned: await Certificate.countDocuments({ user: studentId }),
            recentCertificates: validRecentCertificates
        });

    } catch (error) {
        console.error("Get Student Dashboard Summary Error:", error);
        res.status(500).json({ message: "Server error while fetching dashboard data." });
    }
};