require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Fix: Use correct absolute path for the uploads directory
const uploadsPath = path.join(__dirname, "../uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📂 Created 'uploads' directory.");
}

console.log("🛠️ Serving static files from:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("Welcome to the Social Media API!"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
