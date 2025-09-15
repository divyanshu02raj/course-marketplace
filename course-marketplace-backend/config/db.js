// course-marketplace-backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    // If the database connection fails, the application cannot run.
    // Exit the process with a failure code (1).
    process.exit(1);
  }
};

module.exports = connectDB;