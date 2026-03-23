const Blog = require("../models/Blog");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// ─── Create Blog (any logged-in user) ────────────────────────────────────────
exports.createBlog = async (req, res) => {
  try {
    const { title, content, category, excerpt, tags } = req.body;
    const userId = req.user.id;
    let thumbnailUrl = null;

    if (req.files && req.files.thumbnail) {
      const uploadDetails = await uploadImageToCloudinary(req.files.thumbnail, process.env.FOLDER_NAME);
      thumbnailUrl = uploadDetails.secure_url;
    }

    const cleanExcerpt = excerpt || content.replace(/<[^>]*>?/gm, "").substring(0, 160) + "...";
    const parsedTags = tags ? (typeof tags === "string" ? JSON.parse(tags) : tags) : [];

    const newBlog = await Blog.create({
      title, content, category,
      excerpt: cleanExcerpt,
      tags: parsedTags,
      author: userId,
      thumbnail: thumbnailUrl,
    });

    const populated = await Blog.findById(newBlog._id).populate("author", "firstName lastName image");

    return res.status(201).json({ success: true, data: populated, message: "Blog post published!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Blogs (public) ────────────────────────────────────────────────
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = { status: "published" };
    if (category && category !== "All") query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];

    const blogs = await Blog.find(query)
      .populate("author", "firstName lastName image")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Blog Details (public, increments views) ──────────────────────────
exports.getBlogDetails = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "firstName lastName image email accountType")
      .populate({ path: "comments.user", select: "firstName lastName image" });

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Edit Blog (author or admin only) ────────────────────────────────────
exports.editBlog = async (req, res) => {
  try {
    const { blogId, title, content, category, excerpt, tags, status } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    // Only author or admin can edit
    if (blog.author.toString() !== req.user.id && req.user.accountType !== "Admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    let thumbnailUrl = blog.thumbnail;
    if (req.files && req.files.thumbnail) {
      const uploadDetails = await uploadImageToCloudinary(req.files.thumbnail, process.env.FOLDER_NAME);
      thumbnailUrl = uploadDetails.secure_url;
    }

    const parsedTags = tags ? (typeof tags === "string" ? JSON.parse(tags) : tags) : blog.tags;

    const updated = await Blog.findByIdAndUpdate(
      blogId,
      { title, content, category, excerpt, tags: parsedTags, thumbnail: thumbnailUrl, status: status || blog.status },
      { new: true }
    ).populate("author", "firstName lastName image");

    return res.status(200).json({ success: true, data: updated, message: "Blog updated!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Blog (author or admin only) ───────────────────────────────────
exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (blog.author.toString() !== req.user.id && req.user.accountType !== "Admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Blog.findByIdAndDelete(blogId);
    return res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Toggle Like ────────────────────────────────────────────────────────────
exports.toggleLike = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.id;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const alreadyLiked = blog.likes.includes(userId);
    const updated = await Blog.findByIdAndUpdate(
      blogId,
      alreadyLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: { liked: !alreadyLiked, likeCount: updated.likes.length },
      message: alreadyLiked ? "Like removed" : "Blog liked!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Add Comment (logged-in users only) ──────────────────────────────────
exports.addComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    const userId = req.user.id;
    if (!content || !content.trim()) return res.status(400).json({ success: false, message: "Comment cannot be empty" });

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { comments: { user: userId, content } } },
      { new: true }
    ).populate({ path: "comments.user", select: "firstName lastName image" });

    if (!updatedBlog) return res.status(404).json({ success: false, message: "Blog not found" });
    return res.status(200).json({ success: true, data: updatedBlog, message: "Comment posted!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Comment (comment owner or admin) ──────────────────────────────
exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    if (comment.user.toString() !== req.user.id && req.user.accountType !== "Admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    blog.comments.pull(commentId);
    await blog.save();

    const updated = await Blog.findById(blogId)
      .populate({ path: "comments.user", select: "firstName lastName image" });

    return res.status(200).json({ success: true, data: updated, message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get My Blogs ────────────────────────────────────────────────────────
exports.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate("author", "firstName lastName image")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
