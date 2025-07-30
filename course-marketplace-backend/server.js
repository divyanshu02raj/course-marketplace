// course-marketplace-backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// ✅ FIX: Load environment variables at the very top
dotenv.config();

const connectDB = require("./config/db");

// Import all your route files
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const questionRoutes = require("./routes/questionRoutes");
const noteRoutes = require("./routes/noteRoutes");
const quizRoutes = require("./routes/quizRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const earningsRoutes = require("./routes/earningsRoutes"); // ✅ Add this import
const reviewRoutes = require("./routes/reviewRoutes"); // ✅ Add this import

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  })
);

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/earnings", earningsRoutes); // ✅ Add this line
app.use("/api/reviews", reviewRoutes); // ✅ Add this line


// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({ message: "API Route not found" });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// MongoDB + Server Init
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    } catch(err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

startServer();


//URL for vercel: "https://course-marketplace-ten.vercel.app", // for local http://localhost:3000


