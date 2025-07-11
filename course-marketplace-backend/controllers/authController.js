// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

exports.register = async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const user = await User.create({ name, email, password, role, phone }); // no manual hashing

    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.status(200).json({ message: "Logged out" });
};

exports.updateUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, email, phone, profileImage } = req.body;

    if (phone && !/^\+?[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(profileImage && { profileImage }),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ user: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePassword = async (req, res) => {
  const userId = req.user._id; // from auth middleware
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required." });
  }

  // Password strength check example (min 8 chars, 1 number, 1 uppercase)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: "New password must be at least 8 characters long, include one uppercase letter and one number.",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from the current password." });
    }

    user.password = newPassword;
    user.markModified("password"); // optional, to be safe
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating password." });
  }
};
