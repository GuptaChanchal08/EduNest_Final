const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")
const User = require("../models/User")

exports.checkCertificateEligibility = async (req, res) => {
  try {
    const { courseId } = req.query
    const userId = req.user.id
    
    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: { path: "subSection" }
    })
    if (!course) return res.status(404).json({ success: false, message: "Course not found" })
    
    const isEnrolled = course.studentsEnroled.some(s => s.toString() === userId)
    if (!isEnrolled) return res.status(403).json({ success: false, message: "Not enrolled" })
    
    const totalSubsections = course.courseContent.reduce((a, s) => a + (s.subSection?.length || 0), 0)
    
    const progress = await CourseProgress.findOne({ courseID: courseId, userId })
    const completed = progress?.completedVideos?.length || 0
    const percent = totalSubsections > 0 ? Math.round((completed / totalSubsections) * 100) : 0
    
    return res.status(200).json({
      success: true,
      eligible: percent >= 100,
      percent,
      completed,
      total: totalSubsections,
      courseName: course.courseName,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    
    const course = await Course.findById(courseId).populate({
      path: "instructor", select: "firstName lastName"
    }).populate({
      path: "courseContent",
      populate: { path: "subSection" }
    })
    if (!course) return res.status(404).json({ success: false, message: "Course not found" })
    
    const user = await User.findById(userId).select("firstName lastName")
    
    const totalSubsections = course.courseContent.reduce((a, s) => a + (s.subSection?.length || 0), 0)
    const progress = await CourseProgress.findOne({ courseID: courseId, userId })
    const completed = progress?.completedVideos?.length || 0
    
    if (totalSubsections > 0 && completed < totalSubsections) {
      return res.status(400).json({ success: false, message: "Course not fully completed" })
    }
    
    // Return certificate data (frontend generates PDF)
    return res.status(200).json({
      success: true,
      certificateData: {
        studentName: `${user.firstName} ${user.lastName}`,
        courseName: course.courseName,
        instructorName: `${course.instructor?.firstName} ${course.instructor?.lastName}`,
        completionDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        certificateId: `EDN-${Date.now().toString(36).toUpperCase()}`,
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
