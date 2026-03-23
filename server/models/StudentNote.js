const mongoose = require("mongoose")
const studentNoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  subsectionId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSection" },
  content: { type: String, required: true },
  timestamp: { type: Number }, // video timestamp when note was taken
}, { timestamps: true })
studentNoteSchema.index({ userId: 1, courseId: 1, subsectionId: 1 })
module.exports = mongoose.model("StudentNote", studentNoteSchema)
