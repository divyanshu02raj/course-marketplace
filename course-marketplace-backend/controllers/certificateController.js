const Certificate = require('../models/Certificate');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');

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
            })
            .lean(); // Use lean to allow modification

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found.' });
        }

        if (certificate.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to view this certificate." });
        }
        
        // ** THE FIX IS HERE **
        // Find the assessment and the passing attempt to get the score
        const assessment = await Assessment.findOne({ course: certificate.course._id });
        if (assessment) {
            const attempt = await AssessmentAttempt.findOne({
                assessment: assessment._id,
                student: certificate.user._id,
                passed: true
            }).sort({ score: -1 }); // Get the highest scoring attempt

            if (attempt) {
                certificate.score = attempt.score; // Add score to the response
            }
        }

        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: "Error fetching certificate." });
    }
};

// Verify a certificate publicly
exports.verifyCertificate = async (req, res) => {
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
            return res.status(404).json({ message: 'Certificate not found or invalid.' });
        }

        // ** THE FIX IS HERE **
        // Also find the score for the public verification page
        let finalScore = null;
        const assessment = await Assessment.findOne({ course: certificate.course._id });
        if (assessment) {
            const attempt = await AssessmentAttempt.findOne({
                assessment: assessment._id,
                student: certificate.user._id,
                passed: true
            }).sort({ score: -1 });

            if (attempt) {
                finalScore = attempt.score;
            }
        }

        res.json({
            studentName: certificate.user.name,
            courseTitle: certificate.course.title,
            instructorName: certificate.course.instructor.name,
            issueDate: certificate.issueDate,
            score: finalScore, // Add score to the response
            isValid: true
        });
    } catch (error) {
        res.status(500).json({ message: "Error verifying certificate." });
    }
};
