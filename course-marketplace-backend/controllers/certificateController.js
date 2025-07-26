// controllers/certificateController.js
const Certificate = require('../models/Certificate');

// Get all certificates for the currently logged-in user
exports.getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user._id })
            .populate('course', 'title thumbnail') // Populate course title and thumbnail
            .sort({ issueDate: -1 });
        
        res.json(certificates);
    } catch (error) {
        console.error("Get Certificates Error:", error);
        res.status(500).json({ message: "Error fetching your certificates." });
    }
};
