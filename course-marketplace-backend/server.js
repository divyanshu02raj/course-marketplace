// course-marketplace-backend\server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://course-marketplace-ten.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// ✅ Global middleware
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//URL for vercel: "https://course-marketplace-ten.vercel.app", // for local http://localhost:3000


