const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
    getMyCertificates, 
    getCertificateById,
    verifyCertificate,
    downloadCertificate // 1. Import the new function
} = require("../controllers/certificateController");

// --- PROTECTED ROUTES (for logged-in users) ---
router.get("/my", protect, getMyCertificates);
router.get("/:certificateId", protect, getCertificateById);

// 2. Add the new download route
router.get("/:certificateId/download", protect, downloadCertificate);

// --- PUBLIC ROUTE ---
router.get("/verify/:certificateId", verifyCertificate);

module.exports = router;
