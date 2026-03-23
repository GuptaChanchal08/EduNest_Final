const Announcement = require("../models/Announcement")
const Course = require("../models/Course")

exports.createAnnouncement = async (req, res) => {
  try {
    const { courseId, title, message } = req.body
    const userId = req.user.id
    const course = await Course.findById(courseId)
    if (!course || course.instructor.toString() !== userId)
      return res.status(403).json({ success: false, message: "Not authorized" })
    const ann = await Announcement.create({ courseId, instructor: userId, title, message })
    // Notify all enrolled students
    const { createNotification } = require("./Notification")
    const enrolledCourseInfo = await Course.findById(courseId).select("studentsEnroled courseName")
    if (enrolledCourseInfo?.studentsEnroled?.length) {
      for (const studentId of enrolledCourseInfo.studentsEnroled) {
        await createNotification({
          recipient: studentId,
          type: "announcement",
          title: `New: ${title}`,
          message: message.substring(0, 120) + (message.length > 120 ? "..." : ""),
          link: `/dashboard/announcements`,
          metadata: { courseId, announcementId: ann._id }
        })
      }
    }
    return res.status(201).json({ success: true, data: ann })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
}

exports.getCourseAnnouncements = async (req, res) => {
  try {
    const { courseId } = req.query
    const userId = req.user.id
    const announcements = await Announcement.find({ courseId }).sort({ createdAt: -1 }).lean()
    const withRead = announcements.map(a => ({ ...a, isRead: a.readBy?.some(r => r.toString() === userId) }))
    return res.status(200).json({ success: true, data: withRead })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
}

exports.markAnnouncementRead = async (req, res) => {
  try {
    const { announcementId } = req.body
    const userId = req.user.id
    await Announcement.findByIdAndUpdate(announcementId, { $addToSet: { readBy: userId } })
    return res.status(200).json({ success: true })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
}

// Get ALL announcements for a student across all enrolled courses
exports.getStudentAnnouncements = async (req, res) => {
  try {
    const userId = req.user.id
    const User = require("../models/User")
    const user = await User.findById(userId).select("courses").lean()
    const enrolledCourseIds = user?.courses || []
    if (!enrolledCourseIds.length) {
      return res.status(200).json({ success: true, data: [] })
    }
    const announcements = await Announcement.find({ courseId: { $in: enrolledCourseIds } })
      .sort({ createdAt: -1 })
      .populate("courseId", "courseName thumbnail")
      .populate("instructor", "firstName lastName image")
      .lean()
    const withRead = announcements.map(a => ({
      ...a,
      isRead: a.readBy?.some(r => r.toString() === userId),
    }))
    return res.status(200).json({ success: true, data: withRead })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
}

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.body
    const userId = req.user.id
    const ann = await Announcement.findById(announcementId)
    if (!ann) return res.status(404).json({ success: false, message: "Not found" })
    if (ann.instructor.toString() !== userId) return res.status(403).json({ success: false, message: "Not authorized" })
    await Announcement.findByIdAndDelete(announcementId)
    return res.status(200).json({ success: true })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
}
