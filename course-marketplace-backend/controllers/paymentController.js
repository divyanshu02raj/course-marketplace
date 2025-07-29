// controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Transaction = require('../models/Transaction'); // 1. Import the Transaction model

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        if (typeof course.price !== 'number' || course.price <= 0) {
            return res.status(400).json({ message: "This course cannot be purchased." });
        }
        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "You are already enrolled in this course." });
        }

        const options = {
            amount: Math.round(course.price * 100),
            currency: "INR",
            receipt: `rcpt_${courseId.toString().slice(-8)}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        res.status(500).json({ message: "Failed to create payment order." });
    }
};

// Verify the Payment, Enroll the User, and Create a Transaction
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
            // Payment is authentic.
            const course = await Course.findById(courseId);
            if (!course) return res.status(404).json({ message: "Course not found." });

            // 2. Create the enrollment
            const enrollment = new Enrollment({ user: userId, course: courseId });
            await enrollment.save();

            await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId } });

            // ✅ 3. FIX: Create the transaction record to track the sale for the instructor
            const transaction = new Transaction({
                student: userId,
                instructor: course.instructor, // The ID of the instructor who owns the course
                course: courseId,
                amount: course.price,
                paymentId: razorpay_payment_id,
            });
            await transaction.save();

            res.status(200).json({ success: true, message: "Payment successful and enrolled!" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (error) {
        console.error("Razorpay Verification Error:", error);
        res.status(500).json({ message: "Server error during payment verification." });
    }
};
