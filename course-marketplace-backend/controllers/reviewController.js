// course-marketplace-backend\controllers\reviewController.js
const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Creates a new student review and updates the course's average rating.
exports.createReview = async (req, res) => {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    try {
        // A student must be enrolled in a course to be eligible to review it.
        const isEnrolled = await Enrollment.findOne({ user: userId, course: courseId });
        if (!isEnrolled) {
            return res.status(403).json({ message: "You must be enrolled in a course to review it." });
        }

        // Prevent a user from submitting more than one review for the same course.
        const existingReview = await Review.findOne({ user: userId, course: courseId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this course." });
        }

        const review = new Review({
            user: userId,
            course: courseId,
            rating,
            comment,
        });
        await review.save();

        // After adding the new review, recalculate the course's average rating and review count.
        // This denormalizes the data for efficient display on course listing pages.
        const course = await Course.findById(courseId);
        const reviews = await Review.find({ course: courseId });
        
        course.numReviews = reviews.length;
        course.averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        
        await course.save();

        res.status(201).json({ message: "Review added successfully." });
    } catch (error) {
        console.error("Create Review Error:", error);
        res.status(500).json({ message: "Error creating review." });
    }
};

exports.getReviewsForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const reviews = await Review.find({ course: courseId })
            .populate('user', 'name profileImage')
            .sort({ createdAt: -1 });
        
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews." });
    }
};