import { useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { FiEdit2, FiMail, FiPhone, FiUser, FiCalendar, FiBook, FiEdit, FiBell, FiAward } from "react-icons/fi"
import { formattedDate } from "../../../utils/dateFormatter"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { useEffect, useState } from "react"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import ProgressBar from "@ramonak/react-progress-bar"

export default function MyProfile() {
  const { user } = useSelector(s => s.profile)
  const { token } = useSelector(s => s.auth)
  const { notifications, unreadCount } = useSelector(s => s.notification)
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState(null)

  const isStudent = user?.accountType === ACCOUNT_TYPE.STUDENT
  const isInstructor = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR

  useEffect(() => {
    if (isStudent && token) {
      ;(async () => {
        try {
          const res = await getUserEnrolledCourses(token)
          setEnrolledCourses(res)
        } catch (error) {
          console.log("Could not fetch enrolled courses.")
        }
      })()
    }
  }, [isStudent, token])

  const accountColor = {
    Admin:      { bg: "from-red-600/20 to-red-900/20",    badge: "bg-red-500/20 text-red-400 border-red-500/30" },
    Instructor: { bg: "from-purple-600/20 to-purple-900/20", badge: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    Student:    { bg: "from-blue-600/20 to-blue-900/20",  badge: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  }
  const colors = accountColor[user?.accountType] || accountColor.Student

  return (
    <div className="space-y-8 max-w-[1100px] w-full mx-auto pb-10">
      {/* ── Welcome Header ── */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-richblack-5 font-serif sm:text-4xl">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-richblack-300 text-sm sm:text-base">
          Ready to jump back in?
        </p>
      </div>

      {/* ── Hero Slider (Udemy-like Banner) ── */}
      <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#201d29] to-[#2d233c] p-8 shadow-lg md:p-12 mb-8">
        <div className="relative z-10 flex max-w-[600px] flex-col gap-4">
          <h2 className="text-2xl font-bold text-white md:text-4xl leading-tight">
            Subscribe to the best of EduNest
          </h2>
          <p className="text-richblack-200 md:text-lg">
            Get unlimited access to 8,000+ of our top courses for your team or just for you.
          </p>
        </div>
        <div className="absolute right-[-10%] top-[-20%] w-[300px] md:w-[450px] opacity-30 select-none pointer-events-none">
          <img src="https://res.cloudinary.com/dntfw5cxx/image/upload/v1727781708/p2s9n1q4mxbh2u7_h6zqz5.webp" alt="decoration" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden">
        {/* Cover gradient */}
        <div className={`h-28 bg-gradient-to-r ${colors.bg} relative`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDZ2Nmg2di02aC02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-5">
            <div className="relative">
              <img
                src={user?.image}
                alt={user?.firstName}
                className="w-24 h-24 rounded-2xl border-4 border-richblack-800 object-cover shadow-xl"
              />
              <span className={`absolute -bottom-1 -right-1 text-xs font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                {user?.accountType}
              </span>
            </div>
            <button
              onClick={() => navigate("/dashboard/settings")}
              className="flex items-center gap-2 bg-richblack-700 hover:bg-richblack-600 text-richblack-200 font-medium px-4 py-2.5 rounded-xl transition-all text-sm self-start sm:self-auto"
            >
              <FiEdit2 size={14} /> Edit Profile
            </button>
          </div>

          <h2 className="text-xl font-bold text-richblack-5">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-richblack-400 flex items-center gap-1.5 mt-1 text-sm">
            <FiMail size={12} /> {user?.email}
          </p>

          {user?.additionalDetails?.about && (
            <p className="text-richblack-300 text-sm mt-3 leading-relaxed max-w-lg">
              {user.additionalDetails.about}
            </p>
          )}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: <FiBell className="text-yellow-50" />,
            label: "Notifications",
            value: unreadCount > 0 ? `${unreadCount} unread` : "All caught up",
            link: "/dashboard/notifications",
            highlight: unreadCount > 0,
          },
          {
            icon: <FiBook className="text-blue-400" />,
            label: isInstructor ? "My Courses" : "Enrolled",
            value: isInstructor ? "View →" : "My Learning",
            link: isInstructor ? "/dashboard/my-courses" : "/dashboard/enrolled-courses",
          },
          {
            icon: <FiEdit className="text-green-400" />,
            label: "Blog Posts",
            value: "My Blogs",
            link: "/dashboard/my-blogs",
          },
          {
            icon: <FiAward className="text-purple-400" />,
            label: "Settings",
            value: "Edit Profile",
            link: "/dashboard/settings",
          },
        ].map((stat, i) => (
          <Link key={i} to={stat.link}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
              stat.highlight
                ? "bg-yellow-50/5 border-yellow-50/20 hover:border-yellow-50/40"
                : "bg-richblack-800 border-richblack-700 hover:border-richblack-600"
            }`}>
            <span className="text-xl flex-shrink-0">{stat.icon}</span>
            <div className="min-w-0">
              <p className="text-richblack-400 text-xs">{stat.label}</p>
              <p className={`font-semibold text-sm truncate ${stat.highlight ? "text-yellow-50" : "text-richblack-200"}`}>
                {stat.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-richblack-300 uppercase tracking-wider mb-4">Personal Details</h3>
          <div className="space-y-3">
            {[
              { icon: <FiUser size={14} />, label: "Account Type", value: user?.accountType },
              { icon: <FiPhone size={14} />, label: "Phone", value: user?.additionalDetails?.contactNumber || "Not set" },
              { icon: <FiCalendar size={14} />, label: "Date of Birth", value: user?.additionalDetails?.dateOfBirth ? formattedDate(user.additionalDetails.dateOfBirth) : "Not set" },
              { icon: <FiUser size={14} />, label: "Gender", value: user?.additionalDetails?.gender || "Not set" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-richblack-500 w-4 flex-shrink-0">{item.icon}</span>
                <span className="text-richblack-400 text-xs w-24 flex-shrink-0">{item.label}</span>
                <span className="text-richblack-200 text-sm font-medium truncate">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-richblack-300 uppercase tracking-wider">About Me</h3>
            <button onClick={() => navigate("/dashboard/settings")}
              className="text-xs text-yellow-50 hover:text-yellow-200 flex items-center gap-1 transition-colors">
              <FiEdit2 size={11} /> Edit
            </button>
          </div>
          <p className="text-richblack-300 text-sm leading-relaxed">
             {user?.additionalDetails?.about || "No bio added yet. Click Edit to tell the community about yourself."}
          </p>
        </div>
      </div>

      {/* ── Let's Start Learning (Enrolled Courses) ── */}
      {isStudent && enrolledCourses && enrolledCourses.length > 0 && (
        <div className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-richblack-5 font-serif">Let's start learning</h2>
            <Link to="/dashboard/enrolled-courses" className="text-sm font-medium text-yellow-50 hover:text-yellow-200 shrink-0">
              My learning
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.slice(0, 3).map((course, i, arr) => (
              <div
                className="flex flex-col rounded-xl bg-richblack-800 border border-richblack-700 overflow-hidden shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all cursor-pointer group"
                key={i}
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }}
              >
                <div className="h-[160px] w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10" />
                  <img
                    src={course.thumbnail}
                    alt="course"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="bg-yellow-50 text-richblack-900 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                      <FiBook size={20} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-5 pt-4">
                  <h3 className="text-richblack-5 font-bold mb-1 line-clamp-2 group-hover:text-yellow-100 transition-colors">
                    {course.courseName}
                  </h3>
                  <p className="text-xs text-richblack-300 mb-4 line-clamp-1 flex-1">
                    {course.courseDescription}
                  </p>
                  
                  <div className="mt-auto">
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="8px"
                      isLabelVisible={false}
                      bgColor="#E7C009"
                      baseBgColor="#2C333F"
                      className="mb-2"
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-richblack-300 font-medium">{course.progressPercentage || 0}% complete</span>
                      <span className="text-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity">Continue →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent notifications preview */}
      {notifications.length > 0 && (
        <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-richblack-5 flex items-center gap-3">
              <span className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
                <FiBell size={18} />
              </span>
              Recent Announcements
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">{unreadCount} new</span>
              )}
            </h3>
            <Link to="/dashboard/notifications" className="text-sm font-medium text-yellow-50 hover:text-yellow-200 transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notifications.slice(0, 4).map(n => (
              <div key={n._id} className={`flex items-start gap-4 p-4 rounded-xl transition-all ${!n.isRead ? "bg-richblack-700/50 border border-richblack-600 shadow-sm" : "border border-richblack-700/50 hover:border-richblack-600"}`}>
                <div className="w-10 h-10 rounded-full bg-richblack-800 flex items-center justify-center text-xl shadow-inner shrink-0 border border-richblack-700">
                  {{ enrollment: "🎓", announcement: "📢", welcome: "👋", payment: "💳", course_published: "🚀" }[n.type] || "🔔"}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-sm font-semibold truncate ${n.isRead ? "text-richblack-200" : "text-richblack-5"}`}>{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 bg-yellow-400 rounded-full shrink-0 mt-1" />}
                  </div>
                  <p className="text-richblack-400 text-sm line-clamp-2 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
