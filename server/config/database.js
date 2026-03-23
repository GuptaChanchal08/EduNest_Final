const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

exports.connect = () => {
  if (!MONGODB_URL) {
    console.error("❌ MONGODB_URL is not defined — check server/.env");
    process.exit(1);
  }

  mongoose
    .connect(MONGODB_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    .then(() => console.log("✅ MongoDB Atlas connected successfully"))
    .catch((err) => {
      console.error("❌ DB Connection Failed:", err.message);
      console.error("   Make sure server/.env has the correct MONGODB_URL");
      process.exit(1);
    });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected");
  });
};
