// course-marketplace-backend\server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require('http');
const { Server } = require("socket.io");

// Load environment variables at the very top to ensure they are available throughout the app.
dotenv.config();

const connectDB = require("./config/db");

// Import all application routes
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
const userRoutes = require("./routes/userRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");


const app = express();
// Create an HTTP server from the Express app, which is necessary for Socket.IO integration.
const server = http.createServer(app);

// --- Socket.IO Initialization ---
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Make the `io` instance globally available to all routes by attaching it to the Express app.
// This allows controllers to access it via `req.app.get('socketio')` to emit events.
app.set('socketio', io);

// --- Socket.io Connection Logic ---
let onlineUsers = new Map(); // In-memory store for online users { userId -> socketId }
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user connects, they emit this event to register their presence.
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Allows a client to join a room, typically named after a conversation ID.
  socket.on("joinConversation", ({ conversationId }) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined room ${conversationId}`);
  });

  // When a user disconnects, remove them from the online users map.
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

// --- Core Middleware ---
app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests) and from our allowed list.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
}));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

// --- API Route Mounting ---
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
app.use("/api/users", userRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);

// --- Global Error Handlers ---
// Catch-all for 404 Not Found errors for any unhandled routes.
app.use((req, res) => {
  res.status(404).json({ message: "API Route not found" });
});

// Generic error handler for any other errors that occur in the application.
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        // Ensure the database is connected before starting the server.
        await connectDB();
        server.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    } catch(err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

startServer();