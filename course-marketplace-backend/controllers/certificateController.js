const Certificate = require('../models/Certificate');

// Get all certificates for the currently logged-in user
exports.getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user._id })
            .populate('course', 'title thumbnail')
            .sort({ issueDate: -1 });
        
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your certificates." });
    }
};

// Get a single certificate by its unique ID (for the owner)
exports.getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
            .populate('user', 'name')
            .populate({
                path: 'course',
                select: 'title',
                populate: {
                    path: 'instructor',
                    select: 'name'
                }
            });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found.' });
        }

        if (certificate.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to view this certificate." });
        }

        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: "Error fetching certificate." });
    }
};

/**
 * @desc    Verify a certificate publicly
 * @route   GET /api/certificates/verify/:certificateId
 * @access  Public
 */
exports.verifyCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
            .populate('user', 'name')
            // ** THE FIX IS HERE **
            // Now populating the instructor's name from the course
            .populate({
                path: 'course',
                select: 'title',
                populate: {
                    path: 'instructor',
                    select: 'name'
                }
            });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found or invalid.' });
        }

        // Return all necessary public information to render the certificate
        res.json({
            studentName: certificate.user.name,
            courseTitle: certificate.course.title,
            instructorName: certificate.course.instructor.name,
            issueDate: certificate.issueDate,
            certificateId: certificate.certificateId,
            isValid: true
        });
    } catch (error) {
        res.status(500).json({ message: "Error verifying certificate." });
    }
};
