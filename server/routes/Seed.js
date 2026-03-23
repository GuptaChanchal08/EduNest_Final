const express = require("express")
const router = express.Router()
const { seedData, createAdmin, seedBlogs, seedNotifications } = require("../controllers/Seed")
router.get("/", seedData)
router.get("/create-admin", createAdmin)
router.get("/blogs", seedBlogs)
router.get("/notifications", seedNotifications)
module.exports = router
