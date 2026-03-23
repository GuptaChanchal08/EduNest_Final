const mongoose = require("mongoose")
const announcementSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
}, { timestamps: true })
module.exports = mongoose.model("Announcement", announcementSchema)
