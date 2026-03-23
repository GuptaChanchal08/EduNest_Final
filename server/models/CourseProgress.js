const mongoose = require("mongoose")

const courseProgress = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
  // Quiz scores: { subsectionId: { score, passed, attempts } }
  quizResults: [
    {
      subsectionId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSection" },
      score: { type: Number },       // percentage 0-100
      passed: { type: Boolean },
      attempts: { type: Number, default: 1 },
      lastAttemptAt: { type: Date, default: Date.now },
    }
  ],
})

module.exports = mongoose.model("courseProgress", courseProgress)
