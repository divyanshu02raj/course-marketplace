// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "instructor"], required: true },
    phone: { type: String },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true } // <-- Added timestamps here
);

// Hash password before saving (on register or update)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
