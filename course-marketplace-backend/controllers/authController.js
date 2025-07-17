// controllers/authController.js
// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Generates a JSON Web Token for a user.
 * @param {object} user - The user object from MongoDB.
 * @returns {string} - The generated JWT.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/**
 * Registers a new user, hashes their password, and logs them in.
 */
exports.register = async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Validate phone number format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // 3. Create new user (password will be hashed by the pre-save hook in the User model)
    const user = await User.create({ name, email, password, role, phone });

    // 4. Generate token and log the user in immediately
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 5. Send response
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * Logs in an existing user.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate token and set cookie
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 4. Send response
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * Gets the currently authenticated user's data.
 * Relies on the 'protect' middleware to attach user to req.
 */
exports.getMe = (req, res) => {
  // The 'protect' middleware has already verified the token and attached the user.
  // We just need to send it back.
  res.status(200).json({ user: req.user });
};

/**
 * Logs out the user by clearing the JWT cookie.
 */
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

/**
 * Updates the authenticated user's profile information.
 * Relies on the 'protect' middleware.
 */
exports.updateUser = async (req, res) => {
  try {
    // The user ID is securely provided by the 'protect' middleware.
    const userId = req.user.id;
    const { name, email, phone, profileImage } = req.body;

    // Optional: Validate phone number if provided
    if (phone && !/^\+?[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, profileImage },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("Update User Error:", err);
    // Handle potential duplicate email error
    if (err.code === 11000) {
        return res.status(400).json({ message: "Email is already in use." });
    }
    res.status(500).json({ message: "Server error while updating user" });
  }
};

/**
 * Updates the authenticated user's password.
 * Relies on the 'protect' middleware.
 */
exports.updatePassword = async (req, res) => {
  // The user object is securely provided by the 'protect' middleware.
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Both current and new passwords are required." });
  }

  // Password strength check
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters, with one uppercase letter and one number.",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // Check if the new password is the same as the old one
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "New password must be different from the current one." });
    }

    // Hash and save the new password (pre-save hook will handle hashing)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Update Password Error:", err);
    res.status(500).json({ message: "Server error while updating password." });
  }
};
