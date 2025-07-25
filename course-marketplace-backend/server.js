// course-marketplace-backend/server.js
// course-marketplace-backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

// Import all your route files
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const questionRoutes = require("./routes/questionRoutes"); // ✅ Add this import
const noteRoutes = require("./routes/noteRoutes");       // ✅ Add this import
const quizRoutes = require("./routes/quizRoutes"); // ✅ Add this import

dotenv.config();
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
app.use("/api/questions", questionRoutes); // ✅ Add this line
app.use("/api/notes", noteRoutes);         // ✅ Add this line
app.use("/api/quizzes", quizRoutes); // ✅ Add this line to activate the quiz routes


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


