const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");
const {
  getAllUsers, getAllCourses, deleteUser, deleteCourse,
  getDashboardStats, addCategory, deleteCategory, changeUserRole,
  getAllCategories, updateUserStatus
} = require("../controllers/Admin");

router.get("/stats", auth, isAdmin, getDashboardStats);
router.get("/users", auth, isAdmin, getAllUsers);
router.get("/courses", auth, isAdmin, getAllCourses);
router.get("/categories", auth, isAdmin, getAllCategories);

// POST for delete/update (send id in body - avoids URL issues)
router.post("/delete-user", auth, isAdmin, deleteUser);
router.post("/delete-course", auth, isAdmin, deleteCourse);
router.post("/add-category", auth, isAdmin, addCategory);
router.post("/delete-category", auth, isAdmin, deleteCategory);
router.post("/change-role", auth, isAdmin, changeUserRole);
router.post("/user-status", auth, isAdmin, updateUserStatus);

// Legacy routes kept for backward compat
router.delete("/user", auth, isAdmin, deleteUser);
router.delete("/course", auth, isAdmin, deleteCourse);
router.delete("/category", auth, isAdmin, deleteCategory);
router.put("/change-role", auth, isAdmin, changeUserRole);

module.exports = router;
