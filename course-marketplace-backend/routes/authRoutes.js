// course-marketplace-backend\routes\authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updateUser,
  updatePassword,
  googleLogin,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware"); 

// Standard email/password routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes for user data
router.get("/me", protect, getMe);
router.patch("/update", protect, updateUser);
router.patch("/update-password", protect, updatePassword);

// Google Login Route
router.post("/google-login", googleLogin);

module.exports = router;