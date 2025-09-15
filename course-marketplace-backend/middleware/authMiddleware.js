// course-marketplace-backend\middleware\authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// A lightweight middleware to quickly check if a user is authenticated by verifying their JWT.
// This does NOT fetch the user from the database.
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // If the token is valid, attach its decoded payload to the request object.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Now req.user contains { id, name, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// A full-featured middleware that verifies the token AND fetches the user from the database.
// This is more secure and provides the full user object for downstream logic.
const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by the ID from the token and attach the full user document.
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (err) {
    console.error("Protect middleware error:", err);
    return res.status(401).json({ message: "Token verification failed" });
  }
};

// An authorization middleware to restrict access to instructors only.
// Should be used AFTER an authentication middleware like 'protect' or 'requireAuth'.
const instructorOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "instructor") {
    return res.status(403).json({ message: "Access denied. Not an instructor." });
  }
  next();
};

module.exports = { requireAuth, protect, instructorOnly };