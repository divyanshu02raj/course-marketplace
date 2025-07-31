// course-marketplace-backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require('http'); // 1. Import http
const { Server } = require("socket.io"); // 2. Import socket.io

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

const messageRoutes = require("./routes/messageRoutes"); // ✅ Add this import

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(cookieParser());


const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(","),
    methods: ["GET", "POST"],
  },
});

// 5. Set up the real-time connection logic
let onlineUsers = new Map(); // To track online users

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user connects, they send their userId to join a private room
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online.`);
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    // Remove user from onlineUsers map
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});


// 6. Make the io instance available to your controllers
// This is a simple middleware that attaches 'io' and 'onlineUsers' to every request
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

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
app.use("/api/messages", messageRoutes); // ✅ Add this line


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


