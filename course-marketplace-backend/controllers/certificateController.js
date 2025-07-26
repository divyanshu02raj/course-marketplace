// controllers/certificateController.js
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

// ✅ NEW: Get a single certificate by its unique ID
exports.getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
            .populate('user', 'name')
            .populate('course', 'title');

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found.' });
        }

        // Security check: Only the owner of the certificate can view it
        if (certificate.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to view this certificate." });
        }

        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: "Error fetching certificate." });
    }
};