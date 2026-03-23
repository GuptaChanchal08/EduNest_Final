const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  excerpt: { type: String, trim: true },
  category: { type: String, required: true },
  tags: [{ type: String, trim: true }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  thumbnail: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  comments: [commentSchema],
  status: { type: String, enum: ["published", "draft"], default: "published" },
  views: { type: Number, default: 0 },
}, { timestamps: true });

blogSchema.pre("save", function (next) {
  if (this.isModified("content") && !this.excerpt) {
    this.excerpt = this.content.replace(/<[^>]*>?/gm, "").substring(0, 160) + "...";
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
