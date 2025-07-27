// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Make password not required if signing up with Google
    password: { type: String, required: function() { return !this.googleId; } },
    role: { type: String, enum: ["student", "instructor"], required: true },
    phone: { type: String },
    profileImage: { type: String, default: "" },
    googleId: { type: String, unique: true, sparse: true }, // To store the user's unique Google ID
  },
  { timestamps: true }
);

// Hash password before saving, but only if it's a new password and exists
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
