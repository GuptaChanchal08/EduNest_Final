const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const SubSection = require("../models/Subsection");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").populate("additionalDetails");
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "firstName lastName email")
      .populate("category");
    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId || req.params.userId;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId || req.params.courseId;
    if (!courseId) return res.status(400).json({ success: false, message: "courseId required" });
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    for (const studentId of course.studentsEnroled || []) {
      await User.findByIdAndUpdate(studentId, { $pull: { courses: courseId } });
    }
    for (const sectionId of course.courseContent || []) {
      const section = await Section.findById(sectionId);
      if (section) {
        for (const subId of section.subSection || []) {
          await SubSection.findByIdAndDelete(subId);
        }
        await Section.findByIdAndDelete(sectionId);
      }
    }
    await Course.findByIdAndDelete(courseId);
    return res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ accountType: "Student" });
    const totalInstructors = await User.countDocuments({ accountType: "Instructor" });
    const totalAdmins = await User.countDocuments({ accountType: "Admin" });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: "Published" });
    const draftCourses = await Course.countDocuments({ status: "Draft" });
    const totalCategories = await Category.countDocuments();
    const courses = await Course.find({ status: "Published" }, "price studentsEnroled");
    const totalRevenue = courses.reduce((acc, c) => acc + (c.price || 0) * (c.studentsEnroled?.length || 0), 0);
    return res.status(200).json({
      success: true,
      data: { totalUsers, totalStudents, totalInstructors, totalAdmins, totalCourses, publishedCourses, draftCourses, totalCategories, totalRevenue },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) return res.status(400).json({ success: false, message: "Name and description required" });
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ success: false, message: "Category already exists" });
    const category = await Category.create({ name, description });
    return res.status(200).json({ success: true, data: category, message: "Category created" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.body.categoryId || req.params.categoryId;
    if (!categoryId) return res.status(400).json({ success: false, message: "categoryId required" });
    await Category.findByIdAndDelete(categoryId);
    return res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const userId = req.body.userId || req.params.userId;
    const accountType = req.body.accountType || req.body.role;
    if (!userId || !accountType) return res.status(400).json({ success: false, message: "userId and accountType required" });
    if (!["Admin", "Student", "Instructor"].includes(accountType)) return res.status(400).json({ success: false, message: "Invalid accountType" });
    const user = await User.findByIdAndUpdate(userId, { accountType }, { new: true }).select("-password");
    return res.status(200).json({ success: true, data: user, message: "Role updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, approved } = req.body;
    const user = await User.findByIdAndUpdate(userId, { approved }, { new: true }).select("-password");
    return res.status(200).json({ success: true, data: user, message: `User ${approved ? "approved" : "blocked"}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
