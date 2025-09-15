// course-marketplace-backend\controllers\paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Transaction = require('../models/Transaction');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Creates a payment order on the Razorpay servers.
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
        
        // Prevent users from purchasing a course they are already enrolled in.
        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "You are already enrolled in this course." });
        }

        const options = {
            // Razorpay expects the amount in the smallest currency unit (e.g., paise for INR).
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

// Verifies a payment's authenticity and, if successful, enrolls the user in the course.
exports.verifyRazorpayPayment = async (req, res) => {
    const { courseId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user._id;

    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // This is the critical security step: we recreate the signature on the server
        // using our secret key and compare it to the one sent by the client.
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is authentic. Now, we provision access to the course.
            const course = await Course.findById(courseId);
            if (!course) return res.status(404).json({ message: "Course not found." });

            const enrollment = new Enrollment({ user: userId, course: courseId });
            await enrollment.save();

            await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId } });

            // Create a transaction record for instructor earnings and our own bookkeeping.
            const transaction = new Transaction({
                student: userId,
                instructor: course.instructor,
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