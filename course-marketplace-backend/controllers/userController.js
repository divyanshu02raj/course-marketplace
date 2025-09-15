// course-marketplace-backend\controllers\userController.js
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Generates a list of contacts the current user is allowed to message based on their role and course enrollments.
exports.getMessageContacts = async (req, res) => {
    const { _id: userId, role } = req.user;

    try {
        let contactIds = [];

        if (role === 'student') {
            // A student can message the instructors of any course they are enrolled in.
            const enrollments = await Enrollment.find({ user: userId }).populate({
                path: 'course',
                select: 'instructor'
            });
            
            // Defensively filter out enrollments where the associated course may have been deleted.
            const instructorIds = enrollments
                .filter(e => e.course) 
                .map(e => e.course.instructor);

            // Use a Set to ensure the list of instructor IDs is unique.
            contactIds = [...new Set(instructorIds)]; 
        } 
        else if (role === 'instructor') {
            // An instructor can message any student who is enrolled in any of their courses.
            const instructorCourses = await Course.find({ instructor: userId }).select('_id');
            const courseIds = instructorCourses.map(c => c._id);
            
            const enrollments = await Enrollment.find({ course: { $in: courseIds } }).select('user');
            const studentIds = enrollments.map(e => e.user);

            contactIds = [...new Set(studentIds)];
        }

        // Fetch the user profiles for the final list of contact IDs.
        const contacts = await User.find({ _id: { $in: contactIds } }).select('name email profileImage');
        res.json(contacts);

    } catch (error) {
        console.error("Get Message Contacts Error:", error);
        res.status(500).json({ message: "Error fetching contacts." });
    }
};