const Transaction = require('../models/Transaction');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const Question = require('../models/Question'); // Ensure Question model is imported

// This function is for the main /earnings page with transaction list
exports.getInstructorEarnings = async (req, res) => {
    try {
        const instructorId = req.user._id;

        const transactions = await Transaction.find({ instructor: instructorId })
            .populate('student', 'name')
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const platformFee = totalRevenue * 0.10;
        const netEarnings = totalRevenue - platformFee;
        const totalEnrollments = transactions.length;

        res.json({
            totalRevenue,
            platformFee,
            netEarnings,
            totalEnrollments,
            transactions: transactions.slice(0, 10)
        });

    } catch (error) {
        console.error("Get Earnings Error:", error);
        res.status(500).json({ message: "Error fetching earnings data." });
    }
};

// --- Functions for the main Dashboard View ---

/**
 * @desc    Get key stats for the instructor dashboard cards
 * @route   GET /api/earnings/instructor-stats
 * @access  Private (Instructor)
 */
exports.getInstructorStats = async (req, res) => {
    try {
        const instructorId = req.user._id;

        const totalCourses = await Course.countDocuments({ instructor: instructorId });

        const transactions = await Transaction.find({ instructor: instructorId });
        const totalEnrollments = transactions.length;
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const netEarnings = totalRevenue * 0.90;

        const courses = await Course.find({ instructor: instructorId }).select('_id');
        const courseIds = courses.map(c => c._id);
        
        const reviews = await Review.find({ course: { $in: courseIds } });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        res.json({
            totalCourses,
            totalEnrollments,
            netEarnings,
            averageRating
        });

    } catch (error) {
        console.error("Get Instructor Stats Error:", error);
        res.status(500).json({ message: "Error fetching instructor stats." });
    }
};

/**
 * @desc    Get earnings data for the monthly performance chart
 * @route   GET /api/earnings/performance-chart
 * @access  Private (Instructor)
 */
exports.getPerformanceChartData = async (req, res) => {
    try {
        const instructorId = req.user._id;
        const { year, month } = req.query; // Get year and month from query params

        const now = new Date();
        // Use provided year/month, or default to the current year/month
        const targetYear = year ? parseInt(year) : now.getFullYear();
        // Month in JS is 0-indexed (0=Jan), so we subtract 1
        const targetMonth = month ? parseInt(month) - 1 : now.getMonth();

        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999); // Ensure we get the full last day

        const transactions = await Transaction.find({
            instructor: instructorId,
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // Group earnings by day for the target month
        const dailyEarnings = {};
        const daysInMonth = endOfMonth.getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(targetYear, targetMonth, i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayKey = `${dayName} ${i}`;
            dailyEarnings[dayKey] = 0;
        }
        
        transactions.forEach(t => {
            const date = new Date(t.createdAt);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayKey = `${dayName} ${date.getDate()}`;
            if (dailyEarnings.hasOwnProperty(dayKey)) {
                dailyEarnings[dayKey] += t.amount * 0.90; // Net earnings
            }
        });

        // Format for recharts
        const performanceData = Object.keys(dailyEarnings).map(day => ({
            name: day,
            earnings: dailyEarnings[day]
        }));
        
        res.json(performanceData);

    } catch (error) {
        console.error("Get Performance Chart Error:", error);
        res.status(500).json({ message: "Error fetching performance data." });
    }
};


/**
 * @desc    Get summary data for the "What's New" section
 * @route   GET /api/earnings/dashboard-summary
 * @access  Private (Instructor)
 */
exports.getDashboardSummary = async (req, res) => {
    try {
        const instructorId = req.user._id;
        const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));

        const instructorCourses = await Course.find({ instructor: instructorId }).select('_id');
        const courseIds = instructorCourses.map(c => c._id);

        const unansweredQuestions = await Question.countDocuments({
            course: { $in: courseIds },
            answers: { $size: 0 }
        });

        const recentEnrollments = await Enrollment.countDocuments({
            course: { $in: courseIds },
            createdAt: { $gte: sevenDaysAgo }
        });

        const newReviews = await Review.countDocuments({
            course: { $in: courseIds },
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            unansweredQuestions,
            recentEnrollments,
            newReviews
        });

    } catch (error) {
        console.error("Get Dashboard Summary Error:", error);
        res.status(500).json({ message: "Error fetching dashboard summary." });
    }
};
