const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
    getMyCertificates, 
    getCertificateById,
    verifyCertificate // This was the missing import
} = require("../controllers/certificateController");

// --- PROTECTED ROUTES (for logged-in users) ---
router.get("/my", protect, getMyCertificates);
router.get("/:certificateId", protect, getCertificateById);

// --- PUBLIC ROUTE ---
// GET /api/certificates/verify/:certificateId - Verify a certificate's authenticity
router.get("/verify/:certificateId", verifyCertificate);

module.exports = router;
