// course-marketplace-backend\routes\authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, getMe, logout, updateUser } = require("../controllers/authController");
const requireAuth = require("../middleware/authMiddleware");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);       // Protect this route
router.post("/logout", logout);
router.patch("/update", requireAuth, updateUser); // ✅ Correct, protected

module.exports = router;
