const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")
const { getNotifications, markRead, markAllRead } = require("../controllers/Notification")

router.get("/", auth, getNotifications)
router.post("/mark-read", auth, markRead)
router.post("/mark-all-read", auth, markAllRead)

module.exports = router
