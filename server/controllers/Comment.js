const Comment = require("../models/Comment")
const Course = require("../models/Course")

// Get all comments for a course/lecture
exports.getComments = async (req, res) => {
  try {
    const { courseId, subsectionId } = req.query
    if (!courseId) return res.status(400).json({ success: false, message: "courseId required" })

    const filter = { courseId, parentId: null }
    if (subsectionId) filter.subsectionId = subsectionId

    const comments = await Comment.find(filter)
      .populate("user", "firstName lastName image accountType")
      .sort({ isPinned: -1, createdAt: -1 })
      .lean()

    // Attach replies to each top-level comment
    const commentIds = comments.map(c => c._id)
    const replies = await Comment.find({ parentId: { $in: commentIds } })
      .populate("user", "firstName lastName image accountType")
      .sort({ createdAt: 1 })
      .lean()

    const repliesMap = {}
    replies.forEach(r => {
      const pid = r.parentId.toString()
      if (!repliesMap[pid]) repliesMap[pid] = []
      repliesMap[pid].push(r)
    })

    const result = comments.map(c => ({
      ...c,
      replies: repliesMap[c._id.toString()] || [],
      likeCount: c.likes?.length || 0,
    }))

    return res.status(200).json({ success: true, data: result })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { courseId, subsectionId, text, parentId, timestamp } = req.body
    const userId = req.user.id
    if (!courseId || !text?.trim()) return res.status(400).json({ success: false, message: "courseId and text required" })

    // Check if user is enrolled or is instructor/admin
    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ success: false, message: "Course not found" })

    const isInstructor = course.instructor.toString() === userId
    const isEnrolled = course.studentsEnroled.some(s => s.toString() === userId)
    // Allow instructor and enrolled students
    // (Admin can always comment)

    const comment = await Comment.create({
      courseId,
      subsectionId: subsectionId || null,
      user: userId,
      text: text.trim(),
      parentId: parentId || null,
      isInstructorReply: isInstructor,
      timestamp: timestamp || null,
    })

    const populated = await Comment.findById(comment._id).populate("user", "firstName lastName image accountType")
    return res.status(201).json({ success: true, data: populated })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// Edit a comment
exports.editComment = async (req, res) => {
  try {
    const { commentId, text } = req.body
    const userId = req.user.id
    const comment = await Comment.findById(commentId)
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" })
    if (comment.user.toString() !== userId) return res.status(403).json({ success: false, message: "Not authorized" })
    comment.text = text.trim()
    comment.isEdited = true
    await comment.save()
    const populated = await Comment.findById(commentId).populate("user", "firstName lastName image accountType")
    return res.status(200).json({ success: true, data: populated })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body
    const userId = req.user.id
    const comment = await Comment.findById(commentId)
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" })

    // Allow: own comment, or instructor of course, or admin
    const course = await Course.findById(comment.courseId)
    const isOwner = comment.user.toString() === userId
    const isInstructor = course?.instructor?.toString() === userId
    const isAdmin = req.user.accountType === "Admin"
    if (!isOwner && !isInstructor && !isAdmin) return res.status(403).json({ success: false, message: "Not authorized" })

    // Delete comment and its replies
    await Comment.deleteMany({ parentId: commentId })
    await Comment.findByIdAndDelete(commentId)
    return res.status(200).json({ success: true, message: "Comment deleted" })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// Like/unlike a comment
exports.toggleLike = async (req, res) => {
  try {
    const { commentId } = req.body
    const userId = req.user.id
    const comment = await Comment.findById(commentId)
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" })

    const likedIdx = comment.likes.findIndex(l => l.toString() === userId)
    if (likedIdx === -1) comment.likes.push(userId)
    else comment.likes.splice(likedIdx, 1)
    await comment.save()
    return res.status(200).json({ success: true, liked: likedIdx === -1, likeCount: comment.likes.length })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// Pin/unpin a comment (instructor only)
exports.togglePin = async (req, res) => {
  try {
    const { commentId } = req.body
    const userId = req.user.id
    const comment = await Comment.findById(commentId)
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" })
    const course = await Course.findById(comment.courseId)
    if (course?.instructor?.toString() !== userId) return res.status(403).json({ success: false, message: "Only instructor can pin" })
    comment.isPinned = !comment.isPinned
    await comment.save()
    return res.status(200).json({ success: true, isPinned: comment.isPinned })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
