// course-marketplace-backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require('http');
const { Server } = require("socket.io");

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
const earningsRoutes = require("./routes/earningsRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Socket.io connection logic
let onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online.`);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Middleware to make io instance available to controllers
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

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
app.use("/api/earnings", earningsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);

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
        // ✅ FIX: Use server.listen() to start the server with WebSocket support
        server.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    } catch(err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

startServer();
