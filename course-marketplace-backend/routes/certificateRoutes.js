//course-marketplace-backend\routes\certificateRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
    getMyCertificates, 
    getCertificateById,
    verifyCertificate,
    downloadCertificate
} = require("../controllers/certificateController");

// --- PROTECTED ROUTES (for logged-in users) ---
router.get("/my", protect, getMyCertificates);
router.get("/:certificateId", protect, getCertificateById);
router.get("/:certificateId/download", protect, downloadCertificate);

// --- PUBLIC ROUTE ---
// This endpoint is for the public verification page (via QR code) and requires no authentication.
router.get("/verify/:certificateId", verifyCertificate);

module.exports = router;