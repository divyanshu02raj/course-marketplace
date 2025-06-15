// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController"); // ✅ add getMe
const requireAuth = require("../middleware/authMiddleware"); // ✅ import it

router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);


module.exports = router;
