const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
  type: {
    type: String,
    enum: ["enrollment", "announcement", "course_review", "course_published", "welcome", "payment", "blog_comment"],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },               // e.g. /view-course/:id
  isRead: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed }, // extra data
}, { timestamps: true })

// Auto-delete notifications older than 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

module.exports = mongoose.model("Notification", notificationSchema)
