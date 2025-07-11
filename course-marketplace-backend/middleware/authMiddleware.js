// course-marketplace-backend\middleware\authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Middleware to check for authenticated users (without fetching user data)
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains { id, name, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Middleware to fetch full user from DB and attach to req.user
const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (err) {
    console.error("Protect middleware error:", err);
    return res.status(401).json({ message: "Token verification failed" });
  }
};

// ✅ Middleware to restrict access to instructors only
const instructorOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "instructor") {
    return res.status(403).json({ message: "Access denied. Not an instructor." });
  }
  next();
};

module.exports = { requireAuth, protect, instructorOnly };
