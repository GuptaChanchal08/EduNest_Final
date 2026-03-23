const Notification = require("../models/Notification")

// ─── Get user's notifications ─────────────────────────────────────────────────
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
    const unreadCount = notifications.filter(n => !n.isRead).length
    return res.status(200).json({ success: true, data: notifications, unreadCount })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ─── Mark one notification as read ───────────────────────────────────────────
exports.markRead = async (req, res) => {
  try {
    const { notificationId } = req.body
    await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: req.user.id },
      { isRead: true }
    )
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ─── Mark all notifications as read ──────────────────────────────────────────
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true })
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ─── Internal: create a notification (used by other controllers) ───────────
exports.createNotification = async ({ recipient, type, title, message, link, metadata }) => {
  try {
    await Notification.create({ recipient, type, title, message, link, metadata })
  } catch (err) {
    console.error("Notification create error:", err.message)
  }
}
