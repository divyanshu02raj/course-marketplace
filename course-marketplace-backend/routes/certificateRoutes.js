// routes/certificateRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMyCertificates, getCertificateById } = require("../controllers/certificateController");

// GET /api/certificates/my - Get all certificates for the logged-in user
router.get("/my", protect, getMyCertificates);

// ✅ NEW: GET /api/certificates/:certificateId - Get a single certificate by its ID
router.get("/:certificateId", protect, getCertificateById);

module.exports = router;
