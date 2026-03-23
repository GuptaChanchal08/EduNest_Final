const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  subsectionId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSection", index: true }, // null = course-level comment
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  text: { type: String, required: true, trim: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // null = top-level
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  isInstructorReply: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  timestamp: { type: Number }, // video timestamp in seconds (optional)
}, { timestamps: true })

module.exports = mongoose.model("Comment", commentSchema)
