// course-marketplace-backend/controllers/earningsController.js
const Transaction = require('../models/Transaction');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const Question = require('../models/Question');

// Fetches overall revenue and a list of recent transactions for the main earnings page.
exports.getInstructorEarnings = async (req, res) => {
    try {
        const instructorId = req.user._id;

        const transactions = await Transaction.find({ instructor: instructorId })
            .populate('student', 'name')
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalEnrollments = transactions.length;

        res.json({
            totalRevenue,
            totalEnrollments,
            transactions: transactions.slice(0, 10) // Return only the 10 most recent for the summary view
        });

    } catch (error) {
        console.error("Get Earnings Error:", error);
        res.status(500).json({ message: "Error fetching earnings data." });
    }
};


// --- Functions for the main Dashboard View ---

/**
 * @desc     Get key stats for the instructor dashboard cards
 * @route    GET /api/earnings/instructor-stats
 * @access   Private (Instructor)
 */
// Gathers high-level statistics to be displayed in the main dashboard cards.
exports.getInstructorStats = async (req, res) => {
    try {
        const instructorId = req.user._id;

        const totalCourses = await Course.countDocuments({ instructor: instructorId });

        const transactions = await Transaction.find({ instructor: instructorId });
        const totalEnrollments = transactions.length;
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

        // To calculate average rating, we need to find all courses by the instructor first.
        const courses = await Course.find({ instructor: instructorId }).select('_id');
        const courseIds = courses.map(c => c._id);
        
        const reviews = await Review.find({ course: { $in: courseIds } });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        res.json({
            totalCourses,
            totalEnrollments,
            totalRevenue,
            averageRating
        });

    } catch (error) {
        console.error("Get Instructor Stats Error:", error);
        res.status(500).json({ message: "Error fetching instructor stats." });
    }
};

/**
 * @desc     Get earnings data for the monthly performance chart
 * @route    GET /api/earnings/performance-chart
 * @access   Private (Instructor)
 */
// Prepares and formats earnings data for a daily time-series chart.
exports.getPerformanceChartData = async (req, res) => {
    try {
        const instructorId = req.user._id;
        const { year, month } = req.query;

        const now = new Date();
        const targetYear = year ? parseInt(year) : now.getFullYear();
        const targetMonth = month ? parseInt(month) - 1 : now.getMonth();

        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const transactions = await Transaction.find({
            instructor: instructorId,
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const dailyEarnings = {};
        const daysInMonth = endOfMonth.getDate();

        // Initialize all days of the month with 0 earnings to ensure a complete chart.
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(targetYear, targetMonth, i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayKey = `${dayName} ${i}`;
            dailyEarnings[dayKey] = 0;
        }
        
        // Populate the daily earnings object with actual transaction data.
        transactions.forEach(t => {
            const date = new Date(t.createdAt);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayKey = `${dayName} ${date.getDate()}`;
            if (dailyEarnings.hasOwnProperty(dayKey)) {
                dailyEarnings[dayKey] += t.amount;
            }
        });

        // Convert the earnings object into an array suitable for charting libraries.
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
 * @desc     Get summary data for the "What's New" section
 * @route    GET /api/earnings/dashboard-summary
 * @access   Private (Instructor)
 */
// Fetches counts for recent activities to display in the "What's New" dashboard section.
exports.getDashboardSummary = async (req, res) => {
    try {
        const instructorId = req.user._id;
        const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));

        const instructorCourses = await Course.find({ instructor: instructorId }).select('_id');
        const courseIds = instructorCourses.map(c => c._id);

        const unansweredQuestions = await Question.countDocuments({
            course: { $in: courseIds },
            answers: { $size: 0 } // Questions with an empty 'answers' array
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