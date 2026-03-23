import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FiBell, FiCheck, FiCheckCircle } from "react-icons/fi"
import { apiConnector } from "../../../services/apiConnector"
import { setNotifications, markAllRead, decrementUnread } from "../../../slices/notificationSlice"

const BASE = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"

const typeConfig = {
  enrollment:       { icon: "🎓", bg: "bg-blue-500/10",    border: "border-blue-500/20",   label: "Enrollment" },
  announcement:     { icon: "📢", bg: "bg-yellow-500/10",  border: "border-yellow-500/20", label: "Announcement" },
  course_review:    { icon: "⭐", bg: "bg-purple-500/10",  border: "border-purple-500/20", label: "Review" },
  course_published: { icon: "🚀", bg: "bg-green-500/10",   border: "border-green-500/20",  label: "Published" },
  welcome:          { icon: "👋", bg: "bg-pink-500/10",    border: "border-pink-500/20",   label: "Welcome" },
  payment:          { icon: "💳", bg: "bg-emerald-500/10", border: "border-emerald-500/20",label: "Payment" },
  blog_comment:     { icon: "💬", bg: "bg-orange-500/10",  border: "border-orange-500/20", label: "Blog" },
}

function timeAgo(d) {
  const diff = Date.now() - new Date(d)
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

export default function Notifications() {
  const dispatch = useDispatch()
  const { token } = useSelector(s => s.auth)
  const { notifications, unreadCount } = useSelector(s => s.notification)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", BASE + "/notifications", null, {
          Authorization: `Bearer ${token}`,
        })
        if (res?.data?.success) dispatch(setNotifications(res.data.data))
      } catch {}
    })()
  }, [token, dispatch])

  const handleMarkOne = async (id) => {
    try {
      await apiConnector("POST", BASE + "/notifications/mark-read", { notificationId: id }, {
        Authorization: `Bearer ${token}`,
      })
      dispatch(setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n)))
    } catch {}
  }

  const handleMarkAll = async () => {
    try {
      await apiConnector("POST", BASE + "/notifications/mark-all-read", null, {
        Authorization: `Bearer ${token}`,
      })
      dispatch(markAllRead())
    } catch {}
  }

  const grouped = notifications.reduce((acc, n) => {
    const day = new Date(n.createdAt).toDateString()
    if (!acc[day]) acc[day] = []
    acc[day].push(n)
    return acc
  }, {})

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-richblack-5 flex items-center gap-2">
            <FiBell className="text-yellow-50" /> Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-richblack-400 text-sm mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="flex items-center gap-2 text-sm font-medium text-yellow-50 bg-yellow-50/10 border border-yellow-50/20 px-4 py-2 rounded-xl hover:bg-yellow-50/20 transition-all"
          >
            <FiCheckCircle size={14} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-richblack-800 rounded-2xl border border-richblack-700">
          <FiBell className="text-5xl text-richblack-600 mx-auto mb-4" />
          <h3 className="text-richblack-300 font-semibold mb-1">All caught up!</h3>
          <p className="text-richblack-500 text-sm">No notifications yet. Enroll in a course to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, items]) => (
            <div key={day}>
              <p className="text-xs font-semibold text-richblack-500 uppercase tracking-wider mb-3 px-1">
                {new Date(day).toDateString() === new Date().toDateString() ? "Today" :
                 new Date(day).toDateString() === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" :
                 new Date(day).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
              </p>
              <div className="space-y-2">
                {items.map(n => {
                  const cfg = typeConfig[n.type] || typeConfig.welcome
                  return (
                    <div
                      key={n._id}
                      className={`flex gap-4 p-4 rounded-2xl border transition-all ${
                        n.isRead
                          ? "bg-richblack-800/50 border-richblack-700/50"
                          : `${cfg.bg} ${cfg.border}`
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0 mt-0.5">{cfg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={`font-semibold text-sm ${n.isRead ? "text-richblack-200" : "text-richblack-5"}`}>
                              {n.title}
                            </p>
                            <p className="text-richblack-400 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-richblack-600">{timeAgo(n.createdAt)}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} text-richblack-300`}>
                                {cfg.label}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {n.link && (
                              <Link
                                to={n.link}
                                onClick={() => !n.isRead && handleMarkOne(n._id)}
                                className="text-xs text-yellow-50 hover:text-yellow-200 font-medium whitespace-nowrap"
                              >
                                View →
                              </Link>
                            )}
                            {!n.isRead && (
                              <button
                                onClick={() => handleMarkOne(n._id)}
                                className="p-1.5 rounded-lg text-richblack-400 hover:text-green-400 hover:bg-green-400/10 transition-all"
                                title="Mark as read"
                              >
                                <FiCheck size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
