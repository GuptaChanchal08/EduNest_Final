const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  createBlog, getAllBlogs, getBlogDetails, editBlog,
  deleteBlog, toggleLike, addComment, deleteComment, getMyBlogs,
} = require("../controllers/Blog");

// Public
router.get("/getAllBlogs", getAllBlogs);
router.get("/getBlogDetails/:blogId", getBlogDetails);

// Logged-in users
router.post("/createBlog", auth, createBlog);
router.post("/editBlog", auth, editBlog);
router.delete("/deleteBlog", auth, deleteBlog);
router.post("/toggleLike", auth, toggleLike);
router.post("/addComment", auth, addComment);
router.delete("/deleteComment", auth, deleteComment);
router.get("/myBlogs", auth, getMyBlogs);

module.exports = router;
