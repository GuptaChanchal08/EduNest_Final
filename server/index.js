const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// ─── Optional Security Middleware (graceful if not installed yet) ─────────────
try {
  const helmet = require("helmet");
  app.use(helmet({ crossOriginResourcePolicy: false }));
} catch(e) { /* helmet not installed yet, skip */ }

try {
  const rateLimit = require("express-rate-limit");
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
  const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
  app.use("/api/v1/auth/login", authLimiter);
  app.use("/api/v1/auth/sendotp", authLimiter);
  app.use("/api/v1/", generalLimiter);
} catch(e) { /* express-rate-limit not installed yet, skip */ }

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// CORS — open for local dev, restrict in production
app.use(cors({
  origin: function(origin, callback) {
    // Allow all origins in development
    if (!origin || process.env.NODE_ENV !== "production") return callback(null, true);
    // In production, only allow listed origins
    const allowed = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:3001",
    ].filter(Boolean);
    if (allowed.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/", limits: { fileSize: 10 * 1024 * 1024 } }));

// ─── DB & Cloud ───────────────────────────────────────────────────────────────
database.connect();
cloudinaryConnect();

// ─── Pre-load all models to ensure Mongoose registers them before any route uses them ───
require("./models/User");
require("./models/Profile");
require("./models/Course");
require("./models/Section");
require("./models/Subsection");
require("./models/Category");
require("./models/RatingandReview");
require("./models/CourseProgress");
require("./models/OTP");
require("./models/Blog");
require("./models/Notification");
require("./models/Announcement");
require("./models/Comment");
require("./models/StudentNote");


// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1/auth",          require("./routes/user"));
app.use("/api/v1/profile",       require("./routes/profile"));
app.use("/api/v1/course",        require("./routes/Course"));
app.use("/api/v1/payment",       require("./routes/Payments"));
app.use("/api/v1/reach",         require("./routes/Contact"));
app.use("/api/v1/admin",         require("./routes/Admin"));
app.use("/api/v1/blog",          require("./routes/Blog"));
app.use("/api/v1/comments",      require("./routes/Comment"));
app.use("/api/v1/announcements", require("./routes/Announcement"));
app.use("/api/v1/notes",         require("./routes/StudentNote"));
app.use("/api/v1/wishlist",      require("./routes/Wishlist"));
app.use("/api/v1/certificate",   require("./routes/Certificate"));
app.use("/api/v1/seed",          require("./routes/Seed"));
app.use("/api/v1/notifications",  require("./routes/Notification"));

// ─── Health & 404 ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ success: true, message: "EduNest API is running 🚀" }));
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ EduNest server running on port ${PORT}`));
