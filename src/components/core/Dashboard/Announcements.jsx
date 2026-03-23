import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { FiBell, FiCheck, FiBookOpen } from "react-icons/fi"
import { toast } from "react-hot-toast"
import { apiConnector } from "../../../services/apiConnector"
import { announcementEndpoints } from "../../../services/apis"

const { STUDENT_ALL_API, CREATE_API, GET_API, READ_API, DELETE_API } = announcementEndpoints

function timeAgo(d) {
  const diff = Date.now() - new Date(d)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

// ─── Student Dashboard Page (no courseId prop) ─────────────────────────────
function StudentAnnouncementsPage() {
  const { token } = useSelector(s => s.auth)
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const headers = { Authorization: `Bearer ${token}` }

  const fetchAll = async () => {
    try {
      const res = await apiConnector("GET", STUDENT_ALL_API, null, headers)
      if (res.data.success) setAnnouncements(res.data.data)
    } catch (e) {
      toast.error("Could not load announcements")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleMarkRead = async (announcementId) => {
    try {
      await apiConnector("POST", READ_API, { announcementId }, headers)
      setAnnouncements(a => a.map(ann =>
        ann._id === announcementId ? { ...ann, isRead: true } : ann
      ))
    } catch {}
  }

  const unreadCount = announcements.filter(a => !a.isRead).length

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-8 space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-24 bg-richblack-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-richblack-5 flex items-center gap-2">
            <FiBell className="text-yellow-50" /> Announcements
          </h1>
          <p className="text-richblack-400 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-20 bg-richblack-800 rounded-2xl border border-richblack-700">
          <FiBell className="text-5xl text-richblack-600 mx-auto mb-4" />
          <h3 className="text-richblack-300 font-semibold mb-1">No announcements yet</h3>
          <p className="text-richblack-500 text-sm">
            Enroll in courses to receive announcements from instructors.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map(ann => (
            <div
              key={ann._id}
              className={`flex gap-4 p-4 rounded-2xl border transition-all ${
                ann.isRead
                  ? "bg-richblack-800/50 border-richblack-700/50"
                  : "bg-yellow-50/5 border-yellow-50/20"
              }`}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">📢</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm ${ann.isRead ? "text-richblack-200" : "text-richblack-5"}`}>
                      {ann.title}
                    </p>
                    <p className="text-richblack-300 text-sm mt-1 leading-relaxed">{ann.message}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs text-richblack-500">{timeAgo(ann.createdAt)}</span>
                      {ann.courseId && (
                        <Link
                          to={`/courses/${ann.courseId._id}`}
                          className="flex items-center gap-1 text-xs text-caribbeangreen-300 hover:text-caribbeangreen-200 font-medium"
                        >
                          <FiBookOpen size={11} />
                          {ann.courseId.courseName}
                        </Link>
                      )}
                      {ann.instructor && (
                        <span className="text-xs text-richblack-500">
                          by {ann.instructor.firstName} {ann.instructor.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                  {!ann.isRead && (
                    <button
                      onClick={() => handleMarkRead(ann._id)}
                      className="p-1.5 rounded-lg text-richblack-400 hover:text-green-400 hover:bg-green-400/10 transition-all flex-shrink-0"
                      title="Mark as read"
                    >
                      <FiCheck size={14} />
                    </button>
                  )}
                </div>
              </div>
              {!ann.isRead && (
                <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Inline Announcements Panel (used inside ViewCourse by instructor) ──────
export function InlineCourseAnnouncements({ courseId, isInstructor = false }) {
  const { token } = useSelector(s => s.auth)
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const headers = { Authorization: `Bearer ${token}` }

  const fetchAnnouncements = async () => {
    try {
      const res = await apiConnector("GET", `${GET_API}?courseId=${courseId}`, null, headers)
      if (res.data.success) setAnnouncements(res.data.data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { if (courseId) fetchAnnouncements() }, [courseId])

  const handleCreate = async () => {
    if (!form.title.trim() || !form.message.trim()) { toast.error("Title and message required"); return }
    setSubmitting(true)
    try {
      await apiConnector("POST", CREATE_API, { courseId, ...form }, headers)
      toast.success("Announcement sent to all enrolled students!")
      setForm({ title: "", message: "" }); setShowForm(false)
      fetchAnnouncements()
    } catch { toast.error("Failed to create announcement") }
    setSubmitting(false)
  }

  const handleMarkRead = async (announcementId) => {
    try {
      await apiConnector("POST", READ_API, { announcementId }, headers)
      setAnnouncements(a => a.map(ann => ann._id === announcementId ? { ...ann, isRead: true } : ann))
    } catch {}
  }

  const handleDelete = async (announcementId) => {
    try {
      await apiConnector("POST", DELETE_API, { announcementId }, headers)
      setAnnouncements(a => a.filter(ann => ann._id !== announcementId))
      toast.success("Deleted")
    } catch { toast.error("Failed to delete") }
  }

  const unreadCount = announcements.filter(a => !a.isRead).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-richblack-5 font-semibold flex items-center gap-2">
          <FiBell className={unreadCount > 0 ? "text-yellow-50" : "text-richblack-400"} />
          Announcements
          {unreadCount > 0 && (
            <span className="bg-yellow-50 text-richblack-900 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </h3>
        {isInstructor && (
          <button onClick={() => setShowForm(f => !f)}
            className="flex items-center gap-1.5 bg-yellow-50 text-richblack-900 text-xs font-bold px-3 py-2 rounded-lg hover:bg-yellow-100 transition-all">
            + New Announcement
          </button>
        )}
      </div>

      {showForm && isInstructor && (
        <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-5 space-y-3">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Announcement title"
            className="w-full bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-yellow-50 transition-all" />
          <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            placeholder="Write your message to students..." rows={4}
            className="w-full bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-yellow-50 transition-all resize-none" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="text-richblack-400 hover:text-richblack-200 text-sm px-4 py-2">Cancel</button>
            <button onClick={handleCreate} disabled={submitting}
              className="bg-yellow-50 text-richblack-900 font-bold text-sm px-5 py-2 rounded-xl hover:bg-yellow-100 disabled:opacity-50 transition-all">
              {submitting ? "Sending..." : "Send to All Students"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-16 bg-richblack-700 rounded-xl animate-pulse" />)}</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-8 text-richblack-500 text-sm">No announcements yet.</div>
      ) : (
        <div className="space-y-3">
          {announcements.map(ann => (
            <div key={ann._id}
              className={`p-4 rounded-xl border transition-all ${ann.isRead ? "bg-richblack-800/50 border-richblack-700/50" : "bg-yellow-50/5 border-yellow-50/20"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${ann.isRead ? "text-richblack-300" : "text-richblack-5"}`}>{ann.title}</p>
                  <p className="text-richblack-400 text-xs mt-1">{ann.message}</p>
                  <p className="text-richblack-600 text-xs mt-2">{timeAgo(ann.createdAt)}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!ann.isRead && !isInstructor && (
                    <button onClick={() => handleMarkRead(ann._id)}
                      className="p-1.5 rounded-lg text-richblack-400 hover:text-green-400 transition-all" title="Mark as read">
                      <FiCheck size={12} />
                    </button>
                  )}
                  {isInstructor && (
                    <button onClick={() => handleDelete(ann._id)}
                      className="p-1.5 rounded-lg text-richblack-400 hover:text-red-400 transition-all" title="Delete">
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Default export is the student dashboard page
export default StudentAnnouncementsPage
