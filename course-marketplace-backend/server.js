// course-marketplace-backend\server.js
// server.js
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import your custom modules
const connectDB = require("./config/db");
const configureCloudinary = require("./config/cloudinary"); 
const authRoutes =require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// --- Core Middlewares ---
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(cookieParser()); // Parser for cookies

// --- CORS Configuration ---
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, mobile apps) or from the allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Required to accept cookies from the frontend
  })
);

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);

// --- Error Handling Middlewares ---
// 404 Not Found Handler (runs if no other route is matched)
app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

// Centralized Error Handler (catches errors from any route)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "An unexpected error occurred",
  });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to the database
    await connectDB();
    
    // 2. Configure third-party services like Cloudinary (optional)
    // configureCloudinary();

    // 3. Start the Express server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1); // Exit with failure
  }
};

// Start the server
startServer();

//URL for vercel: "https://course-marketplace-ten.vercel.app", // for local http://localhost:3000


