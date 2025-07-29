// controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create a Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        // ✅ FIX: Add validation to ensure the course has a valid price
        if (typeof course.price !== 'number' || course.price <= 0) {
            return res.status(400).json({ message: "This course does not have a valid price and cannot be purchased." });
        }

        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "You are already enrolled in this course." });
        }

        const options = {
            amount: Math.round(course.price * 100), // Ensure amount is an integer
            currency: "INR",
            // ✅ FIX: Generate a shorter, unique receipt ID that is under 40 characters.
            receipt: `rcpt_${courseId.toString().slice(-8)}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        // ✅ FIX: Add detailed logging to show the exact error from Razorpay
        console.error("Razorpay Order Creation Error:", error);
        res.status(500).json({ message: "Failed to create payment order. See server logs for details." });
    }
};

// 2. Verify the Payment and Enroll the User
exports.verifyRazorpayPayment = async (req, res) => {
    const { courseId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user._id;

    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is authentic, now enroll the user
            const enrollment = new Enrollment({
                user: userId,
                course: courseId,
            });
            await enrollment.save();

            await Course.findByIdAndUpdate(courseId, {
                $addToSet: { enrolledStudents: userId }
            });

            res.status(200).json({ success: true, message: "Payment successful and enrolled!" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (error) {
        console.error("Razorpay Verification Error:", error);
        res.status(500).json({ message: "Server error during payment verification." });
    }
};
