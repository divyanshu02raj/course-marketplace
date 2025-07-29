// controllers/earningsController.js
const Transaction = require('../models/Transaction');
const Course = require('../models/Course');

// Get earnings and stats for the logged-in instructor
exports.getInstructorEarnings = async (req, res) => {
    try {
        const instructorId = req.user._id;

        // Find all successful transactions for this instructor
        const transactions = await Transaction.find({ instructor: instructorId })
            .populate('student', 'name')
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        // Calculate stats
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const platformFee = totalRevenue * 0.10; // Assuming a 10% platform fee
        const netEarnings = totalRevenue - platformFee;
        const totalEnrollments = transactions.length;

        res.json({
            totalRevenue,
            platformFee,
            netEarnings,
            totalEnrollments,
            transactions: transactions.slice(0, 10) // Return the 10 most recent transactions
        });

    } catch (error) {
        console.error("Get Earnings Error:", error);
        res.status(500).json({ message: "Error fetching earnings data." });
    }
};
