const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const requireAuth = require("../middleware/authMiddleware");

// Existing routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);

// ✅ New logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production", // Only secure in production
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
