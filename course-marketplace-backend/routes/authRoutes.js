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
} = require("../controllers/authController");

const { protect, requireAuth } = require("../middleware/authMiddleware"); 

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.patch("/update", protect, updateUser);
router.patch("/update-password", protect, updatePassword); // ✅ password update route

module.exports = router;
