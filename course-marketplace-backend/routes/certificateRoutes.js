// routes/certificateRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMyCertificates } = require("../controllers/certificateController");

// GET /api/certificates/my - Get all certificates for the logged-in user
router.get("/my", protect, getMyCertificates);

module.exports = router;
