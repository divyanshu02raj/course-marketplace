// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) =>
  jwt.sign({ id: user._id, name: user.name , role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });


exports.register = async (req, res) => {
  const { name, email, password, role, phone } = req.body; // ✅ Include phone
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Basic phone validation (e.g., +1234567890, 10–15 digits)
const phoneRegex = /^\+?[0-9]{10,15}$/;
if (phone && !phoneRegex.test(phone)) {
  return res.status(400).json({ message: "Invalid phone number format" });
}
    const user = await User.create({ name, email, password: hashedPassword, role, phone }); // ✅ Store phone

    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone, // ✅ Include in response (optional)
      }
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

    // ✅ Set HTTP-only cookie
    res.cookie("token", token, {
  httpOnly: true,
  sameSite: "Lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
});


    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
           phone: user.phone,
      }
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
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production", // true if deployed over HTTPS
  });
  res.status(200).json({ message: "Logged out" });
};

// PATCH /api/auth/update
exports.updateUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, email, phone } = req.body;

    // Optional: validate email/phone format
    if (phone && !/^\+?[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

