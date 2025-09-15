// course-marketplace-backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Generates a JSON Web Token for a given user.
 * @param {object} user - The user document from MongoDB.
 * @returns {string} The generated JWT.
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

// Handles user sign-in and sign-up through Google OAuth.
exports.googleLogin = async (req, res) => {
    const { token, role } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, sub: googleId, picture: profileImage } = ticket.getPayload();

        // Find user by googleId. If not found, try to link by email, otherwise create a new user.
        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                // User exists with this email, so link the Google account.
                user.googleId = googleId;
                user.profileImage = user.profileImage || profileImage;
                await user.save();
            } else {
                // No user found, create a new one.
                user = await User.create({ name, email, googleId, profileImage, role });
            }
        }

        const jwtToken = generateToken(user);
        res.cookie("token", jwtToken, {
            httpOnly: true,
            // 'None' for cross-site cookies in production, 'Lax' for development.
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            user: {
                id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage,
            },
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(400).json({ message: "Google Sign-In failed. Please try again." });
    }
};

exports.register = async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
    
    // The actual password hashing is handled by a pre-save hook in the User model.
    const user = await User.create({ name, email, password, role, phone });

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        id: user._id, name: user.name, email: user.email, role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Gets the current user's data based on the validated JWT.
exports.getMe = (req, res) => {
  // The 'protect' middleware already verified the token and attached the user to req.user.
  res.status(200).json({ user: req.user });
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, profileImage } = req.body;

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
    // Handles database error for duplicate unique fields (like email).
    if (err.code === 11000) {
        return res.status(400).json({ message: "Email is already in use." });
    }
    res.status(500).json({ message: "Server error while updating user" });
  }
};

// Allows a user to update their password.
exports.updatePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required." });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters, with one uppercase letter and one number.",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // For users who signed up with email/password, we must verify their current password.
    // This check is skipped for social login users who are setting a password for the first time.
    if (user.password) {
        if (!currentPassword) {
            return res.status(400).json({ message: "Current password is required to make this change." });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: "New password must be different from the current one." });
        }
    }
    
    // The pre-save hook in the User model will hash this new password before saving.
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Update Password Error:", err);
    res.status(500).json({ message: "Server error while updating password." });
  }
};