// course-marketplace-backend\models\User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Password is required only if the user is not signing up via Google OAuth.
    password: { type: String, required: function() { return !this.googleId; } },
    role: { type: String, enum: ["student", "instructor"], required: true },
    phone: { type: String },
    profileImage: { type: String, default: "" },
    // The unique ID from Google. The 'sparse' option ensures the uniqueness constraint only applies to users who have this field.
    googleId: { type: String, unique: true, sparse: true }, 
  },
  { timestamps: true }
);

// Mongoose middleware to automatically hash the password before saving a user document.
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new) and actually exists.
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