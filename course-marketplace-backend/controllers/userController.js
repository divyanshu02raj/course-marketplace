// controllers/userController.js
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Get a list of users that the current user can message
exports.getMessageContacts = async (req, res) => {
    const { _id: userId, role } = req.user;

    try {
        let contactIds = [];

        if (role === 'student') {
            // A student can message instructors of their enrolled courses.
            const enrollments = await Enrollment.find({ user: userId }).populate({
                path: 'course',
                select: 'instructor'
            });
            
            // ✅ FIX: Filter out enrollments where the course has been deleted
            const instructorIds = enrollments
                .filter(e => e.course) // Ensure the course exists
                .map(e => e.course.instructor);

            contactIds = [...new Set(instructorIds)]; // Get unique instructor IDs
        } 
        else if (role === 'instructor') {
            // An instructor can message any student enrolled in any of their courses.
            const instructorCourses = await Course.find({ instructor: userId }).select('_id');
            const courseIds = instructorCourses.map(c => c._id);
            
            const enrollments = await Enrollment.find({ course: { $in: courseIds } }).select('user');
            const studentIds = enrollments.map(e => e.user);
            contactIds = [...new Set(studentIds)]; // Get unique student IDs
        }

        const contacts = await User.find({ _id: { $in: contactIds } }).select('name email profileImage');
        res.json(contacts);

    } catch (error) {
        console.error("Get Message Contacts Error:", error);
        res.status(500).json({ message: "Error fetching contacts." });
    }
};
