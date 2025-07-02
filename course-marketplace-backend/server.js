// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "https://course-marketplace-ten.vercel.app", // ✅ Replace with your real Vercel URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


app.use(express.json()); // ✅ Add this line
app.use(cookieParser());
app.use("/api/auth", require("./routes/authRoutes"));



app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//URL for vercel: "https://course-marketplace-ten.vercel.app", // for local http://localhost:3000
