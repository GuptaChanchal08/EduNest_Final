const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
  title: { type: String },
  timeDuration: { type: String },
  description: { type: String },
  videoUrl: { type: String },

  // NEW: Content type system
  contentType: {
    type: String,
    enum: ["video", "youtube", "quiz", "notes"],
    default: "video",
  },

  // YouTube support
  youtubeVideoId: { type: String }, // e.g. "dQw4w9WgXcQ"

  // Quiz support
  quiz: {
    questions: [
      {
        question: { type: String },
        options: [{ type: String }],
        correctAnswerIndex: { type: Number },
        explanation: { type: String },
      },
    ],
    passingScore: { type: Number, default: 60 }, // percentage
  },

  // Notes/Article support
  notes: { type: String }, // markdown or HTML content
});

module.exports = mongoose.model("SubSection", SubSectionSchema);
