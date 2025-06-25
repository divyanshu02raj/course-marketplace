const express = require("express");
const router = express.Router();
const { register, login, getMe, logout } = require("../controllers/authController");
const requireAuth = require("../middleware/authMiddleware");

// Existing routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);

router.post("/logout", logout);

module.exports = router;
